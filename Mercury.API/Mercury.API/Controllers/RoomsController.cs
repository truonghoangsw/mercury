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
        public Player Post([FromBody] string userName)
        {
            var player = new Player
            {
                Name = userName,
                PlayerId = Guid.NewGuid(),
            };
            DataMemory.Users.Add(player);
            return player;
        }


        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public void Delete(Guid id)
        {
            var data = DataMemory.Users.FirstOrDefault(p => p.PlayerId == id);
            if (data != null)
            {
                DataMemory.Users.Remove(data);
            }
        }
    }
}
