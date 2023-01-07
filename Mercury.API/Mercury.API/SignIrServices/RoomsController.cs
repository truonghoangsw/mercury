//using Mercury.API.Data;
//using Mercury.API.Models;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.SignalR;
//using System.Collections.Concurrent;

//// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

//namespace Mercury.API.Controllers
//{
   
//    public class RoomsHub : Hub
//    {
//        public async Task GetRoom()
//        {
//           await Clients.Caller.SendAsync("GetRoom", DataMemory.Rooms);
//        }

//        public async Task Get(Guid id)
//        {
//            await Clients.Caller.SendAsync("GetRoom", DataMemory.Rooms.FirstOrDefault(p => p.RoomId == id));

//        }

//        // POST api/<UserController>
//        [HttpPost]
//        public Room Post([FromBody] List<Guid> playerIds)
//        {
//            var players = DataMemory.Users.Where(p => playerIds.Contains(p.PlayerId)).ToList();
//            var romNew = new Room()
//            {
//                RoomId = Guid.NewGuid(),
//                Players = new BlockingCollection<Player>()
//            };
//            foreach (var player in players)
//            {
//                romNew.Players.Add(player);
//            }
//            DataMemory.Rooms.Add(romNew);
//            return romNew;
//        }
        
//        [HttpPost]
//        [Route("add")]
//        public Room AddToRoom([FromBody] List<Guid> playerIds,Guid roomId)
//        {
//            var players = DataMemory.Users.Where(p => playerIds.Contains(p.PlayerId)).ToList();
//            var room  = DataMemory.Rooms.FirstOrDefault(s=>s.RoomId == roomId);
//            room.Player.AddRange(players);
//            return room;
//        }
        
//        [HttpPost]
//        [Route("remove")]
//        public Room RemoveFromRoom([FromBody] List<Guid> playerIds, Guid roomId)
//        {
//            var players = DataMemory.Users.Where(p => playerIds.Contains(p.PlayerId)).ToList();
//            var room = DataMemory.Rooms.FirstOrDefault(s => s.RoomId == roomId);
//            foreach (var player in players)
//            {
//                room.Player.Remove(player);
//            }
            
//            if(room.Player.Count == 0)
//                DataMemory.Rooms.Remove(room);
//            return room;
//        }
        
//    }
//}
