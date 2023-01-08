using Mercury.API.Data;
using System;
using System.Collections.Concurrent;

namespace Mercury.API.Models
{
    public class Room
    {
        private Room()
        {
            RoomId = Guid.NewGuid();
            Players = new ConcurrentDictionary<Guid, Score>();
            CurrentGameId = 0;
        }

        public Guid RoomId { get; set; }
        public ConcurrentDictionary<Guid, Score> Players { get; set; }
        public string GroupSocketId { get; set; }
        public int CurrentGameId { get; set; }
        public bool IsEndMatch { get;set;}
        
        public static Room Create()
        {
            var room = new Room();
            DataMemory.Rooms.TryAdd(room.RoomId, room);
            return room;
        }

        public void AddPlayer(Player player)
        {
            Players.TryAdd(player.PlayerId, new Score(player));
        }

        internal void Reset()
        {
            IsEndMatch = false;
            foreach (var player in Players)
            {
                player.Value.WinSet = 0;
                player.Value.PointInCurrentSet = 0;
            }
        }
    }

    public class Score
    {
        public Score(Player player)
        {
            this.Player = player;
        }
        public Player Player { get; set; }
        public int PointInCurrentSet { get; set; }
        public int WinSet { get; set; }
    }

    public class Player
    {
        public string Name { get; set; }
        public string ConnectionId { get; set; }
        public Guid PlayerId { get; set; }
        public string GroupSocketId { get; set; }
    }
}
