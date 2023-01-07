using Mercury.API.Data;
using Mercury.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Numerics;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Mercury.API.Controllers
{
    public class UserHub : Hub
    {
        public async Task GetUsers()
        {
            await Clients.Caller.SendAsync("GetUsers", DataMemory.Users);
        }
     
        public async Task GetUsersById(Guid id)
        {
            await Clients.Caller.SendAsync("GetUsers", DataMemory.Users.FirstOrDefault(p => p.PlayerId == id));
        }
     
        public async Task AddUser([FromBody] string userName)
        {
            var player = new Player
            {
                Name = userName,
                PlayerId = Guid.NewGuid(),
            };
            DataMemory.Users.Add(player);
            await Clients.Caller.SendAsync("AddUser", player);
        }

        public async Task DeleteUser(Guid id)
        {
            var data = DataMemory.Users.FirstOrDefault(p => p.PlayerId == id);
            if(data != null)
            {
                DataMemory.Users.Remove(data);
            }
            await Clients.Caller.SendAsync("DeleteUser", true);
        }
    }
}
