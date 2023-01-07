using Mercury.API.Data;
using Mercury.API.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Mercury.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        // GET: api/<UserController>
        [HttpGet]
        public IEnumerable<Room> Get()
        {
            return DataMemory.Rooms;
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public Room? Get(Guid id)
        {
            return DataMemory.Rooms.FirstOrDefault(p => p.RoomId == id);
        }

        // POST api/<UserController>
        [HttpPost]
        public Room Post([FromBody] List<Guid> playerIds)
        {
            var players = DataMemory.Users.Where(p => playerIds.Contains(p.PlayerId)).ToList();
            var romNew = new Room()
            {
                RoomId = Guid.NewGuid(),
                Player = players
            };
            DataMemory.Rooms.Add(romNew);
            return romNew;
        }
        
        [HttpPost]
        [Route("add")]
        public Room AddToRoom([FromBody] List<Guid> playerIds,Guid roomId)
        {
            var players = DataMemory.Users.Where(p => playerIds.Contains(p.PlayerId)).ToList();
            var room  = DataMemory.Rooms.FirstOrDefault(s=>s.RoomId == roomId);
            room.Player.AddRange(players);
            return room;
        }
        
        [HttpPost]
        [Route("remove")]
        public Room RemoveFromRoom([FromBody] List<Guid> playerIds, Guid roomId)
        {
            var players = DataMemory.Users.Where(p => playerIds.Contains(p.PlayerId)).ToList();
            var room = DataMemory.Rooms.FirstOrDefault(s => s.RoomId == roomId);
            foreach (var player in players)
            {
                room.Player.Remove(player);
            }
            
            if(room.Player.Count == 0)
                DataMemory.Rooms.Remove(room);
            return room;
        }
        
    }
}
