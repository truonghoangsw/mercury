using Mercury.API.Data;
using Mercury.API.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace Mercury.API.SignIrServices
{
    public partial class HubSockets : Hub
    {
        public async Task EnterRoom(EnterRoomModel model)
        {
            
            if (!DataMemory.Users.TryGetValue(model.UserId, out var player)){
                return ;
            }

            if (!DataMemory.Rooms.TryGetValue(model.RoomId, out var room))
            {
                room = new Room
                {
                    RoomId = model.RoomId,
                };
            }
            room.AddPlayer(player);
            DataMemory.Rooms.TryAdd(room.RoomId,room);
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
