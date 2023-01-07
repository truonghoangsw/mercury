using Mercury.API.Data;
using Mercury.API.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace Mercury.API.SignIrServices
{
    public class HubSockets : Hub
    {
        public async Task EnterRoom(EnterRoomModel model)
        {
            var player = DataMemory.Users.Find(x => x.PlayerId == model.UserId);

            if (player is null) return;

            var room = DataMemory.Rooms.Find(x => x.RoomId == model.RoomId);

            if (room is null)
            {
                room = new Room
                {
                    RoomId = model.RoomId,
                    Players = new BlockingCollection<Player>(),
                };
            }
            room.Players.Add(player!);

            DataMemory.Rooms.Add(room);

            await Groups.AddToGroupAsync(Context.ConnectionId, model.RoomId.ToString());

            await Clients.Group(room.RoomId.ToString())
                .SendAsync(nameof(EnterRoom), room.Players);
        }

        public async Task StartGame(StartGameModel model)
        {
            await Clients.Group(model.RoomId.ToString())
                .SendAsync(nameof(StartGame), $"{model.RoomId} started.");
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

    public class EnterRoomModel
    {
        public Guid RoomId { get; set; }
        public Guid UserId { get; set; }
    }

    public class StartGameModel
    {
        public Guid RoomId { get; set; }
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
