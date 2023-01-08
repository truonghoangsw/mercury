using Mercury.API.Data;
using Mercury.API.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace Mercury.API.SignIrServices
{
    
    public partial class HubSockets : Hub
    {
        public object _waitingPlayerLock = new();
        public Player? WaitingPlayer { get; set; }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var playerDis = DataMemory.Users.Values.FirstOrDefault(s => s.ConnectionId == Context.ConnectionId);

            if (playerDis?.RoomId.HasValue != true) return;

            if (!DataMemory.Rooms.TryGetValue(playerDis!.RoomId!.Value, out var room))
            {
                await Clients.Caller
                    .SendAsync("ErrorMessage", "Invalid room");
                return;
            }

            room.Players.TryRemove(playerDis.PlayerId, out _);

            room.Reset();

            await Clients.Group(room.RoomId.ToString()).SendAsync("PlayerDisconnect", playerDis);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, room.RoomId.ToString());

            await base.OnDisconnectedAsync(exception);
        }
        
        public async Task CreateRoom(EnterRoomModel model)
        {
            if (!DataMemory.Users.TryGetValue(model.UserId, out var player))
            {
                await Clients.Caller
                    .SendAsync("ErrorMessage", "Invalid player");
                return;
            }

            var room = Room.Create();

            room.AddPlayer(player);

            await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomId.ToString());

            await Clients.Group(room.RoomId.ToString())
                .SendAsync(nameof(CreateRoom), room);
        }
        
        public async Task EnterRoom(EnterRoomModel model)
        {
            if (!DataMemory.Rooms.TryGetValue(model.RoomId, out var room))
            {
                await Clients.Caller
                    .SendAsync("ErrorMessage", "Invalid room");
                return;
            }

            if (room.Players.Count > 2)
            {
                await Clients.Group(room.RoomId.ToString())
                    .SendAsync("ErrorMessage", "Too many people in room");
            }
            
            if (!DataMemory.Users.TryGetValue(model.UserId, out var player))
            {
                await Clients.Caller
                    .SendAsync("ErrorMessage", "Invalid player");
                return;
            }

            if (player.RoomId.HasValue)
            {
                await Clients.Group(room.RoomId.ToString())
                    .SendAsync("ErrorMessage", "Player already joined a room");
                return;
            }
            
            player.JoinRoom(model.RoomId);
            
            room.AddPlayer(player);

            DataMemory.Rooms.TryAdd(room.RoomId, room);

            await Groups.AddToGroupAsync(Context.ConnectionId, model.RoomId.ToString());

            room.StartGame();

            await Clients.Group(room.RoomId.ToString())
                .SendAsync("StartGame", room);
        }

        public async Task ReplayMatch(ReaplayMatchModel model)
        {
            if (!DataMemory.Rooms.TryGetValue(model.RoomId, out var room))
            {
                await Clients.Caller
                    .SendAsync("ErrorMessage", "Invalid room");
                return;
            }

            if (model.CurrentGameId != room.CurrentGameId)
            {
                await Clients.Group(room.RoomId.ToString())
                    .SendAsync("ErrorMessage", "Invalid action");
                return;
            }
            
            room.Reset();

            room.StartGame();

            await Clients.Group(room.RoomId.ToString())
                .SendAsync("StartGame", room);
        }

        public async Task GameOver(GameOverModel model)
        {
            if (!DataMemory.Rooms.TryGetValue(model.RoomId, out var room))
            {
                await Clients.Caller
                    .SendAsync("ErrorMessage", "Invalid room");
                return;
            }

            if (model.CurrentGameId != room.CurrentGameId)
            {
                await Clients.Group(room.RoomId.ToString())
                    .SendAsync("ErrorMessage", "Invalid action");
                return;
            }

            if (!room.Players.TryGetValue(model.UserId, out var loser))
            {
                await Clients.Caller
                    .SendAsync("ErrorMessage", "Invalid player");
                return;
            }

            var winner = room.Players.Values.FirstOrDefault(x => x != loser);

            winner!.PointInCurrentSet++;
            if (winner.PointInCurrentSet >= 2)
            {
                winner.WinSet++;
                winner.PointInCurrentSet = 0;
                loser.PointInCurrentSet = 0;
                if (winner.WinSet >= 2)
                {
                    room.IsEndMatch = true;
                }
            }

            room.StartGame();

            await Clients.Group(model.RoomId.ToString())
                .SendAsync(nameof(GameOver), new 
                {
                    Room = room,
                    WinnerId = winner.Player.PlayerId,
                });
        }

        public async Task AutoMatch(AutoMatchModel model)
        {
            if (!DataMemory.Users.TryGetValue(model.UserId, out var _waitingPlayer))
            {
                await Clients.Caller
                    .SendAsync("ErrorMessage", "Invalid player");
                return;
            }
            Room? room = null;
            lock (_waitingPlayerLock)
            {
                if (WaitingPlayer is null)
                {
                    WaitingPlayer = _waitingPlayer;
                    return;
                }
                else
                {
                    if (!DataMemory.Users.TryGetValue(model.UserId, out var player_1))
                    {
                        return;
                    }
                    room = Room.Create();
                    room.AddPlayer(player_1);
                    room.AddPlayer(WaitingPlayer);
                    DataMemory.Rooms.TryAdd(room.RoomId, room);
                }
            }

            if (room is null) return;

            await Clients.Group(room.RoomId.ToString())
              .SendAsync(nameof(AutoMatch), room.Players);

            WaitingPlayer = null;
        }

        public async Task SyncEvent(SyncEventModel model)
        {
            await Clients.Group(model.RoomId.ToString())
                .SendAsync(nameof(SyncEvent), model);
        }
    }

    public class CreateRoomModel
    {
        public Guid UserId { get; set; }
    }

    public class EnterRoomModel
    {
        public Guid RoomId { get; set; }
        public Guid UserId { get; set; }
    }

    public class ReaplayMatchModel
    {
        public Guid RoomId { get; set; }
        public int CurrentGameId { get; set; }
    }

    public class GameOverModel
    {
        public Guid RoomId { get; set; }
        public Guid UserId { get; set; }
        public int CurrentGameId { get;set;}
    }
    public class AutoMatchModel
    {
        public Guid UserId { get; set; }
    }

    public class SyncEventModel
    {
        public Guid RoomId { get; set; }
        public string EventType { get; set; }
        public object EventData { get; set; }
    }
}
