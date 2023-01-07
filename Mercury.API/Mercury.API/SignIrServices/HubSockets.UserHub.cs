using Mercury.API.Data;
using Mercury.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Numerics;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Mercury.API.SignIrServices
{
    public partial class HubSockets : Hub
    {
      
        //public async Task GetUsersById(Guid id)
        //{
        //    await Clients.Caller.SendAsync("GetUsers", DataMemory.Users.FirstOrDefault(p => p.PlayerId == id));
        //}
     
        public async Task AddUser(string userName)
        {
            var player = new Player
            {
                Name = userName,
                PlayerId = Guid.NewGuid(),
                ConnectionId = Context.ConnectionId
            };
            DataMemory.Users.TryAdd(player.PlayerId,player);
            await Clients.Caller.SendAsync("AddUser", player);
        }
    }
}
