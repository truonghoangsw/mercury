using Mercury.API.Data;
using Mercury.API.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace Mercury.API.SignIrServices
{
    public partial class HubSockets : Hub
    {
        public object _lockObject = new();
        public Player? WaitingPlayer { get; set; }
        public async Task CreateRoom(EnterRoomModel model)
        {
            if (!DataMemory.Users.TryGetValue(model.UserId, out var player))
            {
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
            if (!DataMemory.Users.TryGetValue(model.UserId, out var player))
            {
                return;
            }

            if (!DataMemory.Rooms.TryGetValue(model.RoomId, out var room))
            {
                return;
            }

            room.AddPlayer(player);

            DataMemory.Rooms.TryAdd(room.RoomId,room);

            await Groups.AddToGroupAsync(Context.ConnectionId, model.RoomId.ToString());

            room.CurrentGameId++;

            await Clients.Group(room.RoomId.ToString())
                .SendAsync("StartGame", room);
        }

        public async Task ReplayMatch(ReaplayMatchModel model)
        {
            if (!DataMemory.Rooms.TryGetValue(model.RoomId, out var room))
            {
                return;
            }

            if (model.CurrentGameId != room.CurrentGameId) return;
            
            room.Reset();

            room.CurrentGameId++;

            await Clients.Group(room.RoomId.ToString())
                .SendAsync("StartGame", room);
        }

        public async Task GameOver(GameOverModel model)
        {
            if (!DataMemory.Rooms.TryGetValue(model.RoomId, out var room))
            {
                return;
            }

            if (room.CurrentGameId != model.CurrentGameId)
            {
                return;
            }

            if (!room.Players.TryGetValue(model.UserId, out var loser))
            {
                return;
            }

            var winner = room.Players.Values.FirstOrDefault(x => x != loser);

            winner.PointInCurrentSet++;
            if (winner.PointInCurrentSet >= 5)
            {
                winner.WinSet++;
                winner.PointInCurrentSet = 0;
                loser.PointInCurrentSet = 0;
                if (winner.WinSet >= 2)
                {
                    room.IsEndMatch = true;
                }
            }

            room.CurrentGameId++;
            
            await Clients.Group(model.RoomId.ToString())
                .SendAsync(nameof(GameOver), room);
        }

        public async Task AutoMatch(AutoMatchModel model)
        {
            if (!DataMemory.Users.TryGetValue(model.UserId, out var _waitingPlayer))
            {
                return;
            }
            Room? room = null;
            lock (_lockObject)
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
