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

            await Groups.AddToGroupAsync(Context.ConnectionId, model.RoomId.ToString());

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

            await Clients.Group(room.RoomId.ToString())
                .SendAsync(nameof(EnterRoom), room);
        }

        public async Task StartGame(StartGameModel model)
        {
            await Clients.Group(model.RoomId.ToString())
                .SendAsync(nameof(StartGame), $"{model.RoomId} started.");
        }

        public async Task GameOver(GameOverModel model)
        {
            await Clients.GroupExcept(model.RoomId.ToString(), new List<string> { Context.ConnectionId })
                .SendAsync(nameof(GameOver), $"{model.RoomId} end.");
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
            switch (model.EventType)
            {
                case EventType.HitObject:
                    //TODO: handle logic hit object and add score
                    await Clients.Group(model.RoomId.ToString())
                        .SendAsync(nameof(SyncEvent), model);
                    break;
                default:
                    break;
            }
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

    public class StartGameModel
    {
        public Guid RoomId { get; set; }
    }

    public class GameOverModel
    {
        public Guid RoomId { get; set; }
    }
    public class AutoMatchModel
    {
        public Guid UserId { get; set; }
    }

    public enum EventType
    {
        HitObject
    }

    public class SyncEventModel
    {
        public EventType EventType { get; set; }
        public Guid RoomId { get; set; }
        public Guid UserId { get; set; }
        public DateTime Time { get; set; }
    }

    public class EventData_HitObject
    {
        public Guid RoomId { get; set; }
        public Guid UserId { get; set; }
        public DateTime Time { get; set; }
    }
}
