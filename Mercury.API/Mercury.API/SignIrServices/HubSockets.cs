using Mercury.API.Data;
using Mercury.API.Models;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System.Collections.Concurrent;

namespace Mercury.API.SignIrServices
{
    public static class SocketAction
    {
        public const string EnterRoom = "enter_room";
        public const string StartGame = "start_game";
        public const string SyncEvent = "sync_event";
    }

    public class HubSockets : Hub
    {
        public async Task SendMessage(string action, string message)
        {
            switch (action)
            {
                case SocketAction.EnterRoom:
                    await EnterRoom(JsonConvert.DeserializeObject<EnterRoomModel>(message)!);
                    break;
                case SocketAction.StartGame:
                    await StartGame(JsonConvert.DeserializeObject<StartGameModel>(message)!);
                    break;
                case SocketAction.SyncEvent:
                    await SyncEvent(JsonConvert.DeserializeObject<SyncEventModel>(message)!);
                    break;
                default:
                    break;
            }
        }

        private async Task EnterRoom(EnterRoomModel model)
        {
            var player = DataMemory.Users.FirstOrDefault(x => x.PlayerId == model.UserId);

            if (player is null) return;

            var room = DataMemory.Rooms.FirstOrDefault(x => x.RoomId == model.RoomId);

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
                .SendAsync(SocketAction.EnterRoom, JsonConvert.SerializeObject(room.Players));
        }

        private async Task StartGame(StartGameModel model)
        {
            await Clients.Group(model.RoomId.ToString())
                .SendAsync(SocketAction.StartGame, $"{model.RoomId} started.");
        }

        private async Task SyncEvent(SyncEventModel model)
        {
            switch (model.EventType)
            {
                case EventType.HitObject:
                    //TODO: handle logic hit object and add score
                    await Clients.Group(model.RoomId.ToString())
                        .SendAsync(EventType.HitObject, JsonConvert.SerializeObject(model));
                    break;
                default:
                    break;
            }
        }
    }

    internal class EnterRoomModel
    {
        public Guid RoomId { get; set; }
        public Guid UserId { get; set; }
    }

    internal class StartGameModel
    {
        public Guid RoomId { get; set; }
    }

    public static class EventType
    {
        public const string HitObject = "hit_object";
    }

    internal class SyncEventModel
    {
        public string? EventType { get; set; }
        public Guid RoomId { get; set; }
        public Guid UserId { get; set; }
        public DateTime Time { get; set; }
    }

    internal class EventData_HitObject
    {
        public Guid RoomId { get; set; }
        public Guid UserId { get; set; }
        public DateTime Time { get; set; }
    }
}
