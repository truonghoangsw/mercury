using Mercury.API.Data;
using Mercury.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Mercury.API.Controllers
{
   
    public class RoomsHub : Hub
    {
        //public async Task GetRoom()
        //{
        //   await Clients.Caller.SendAsync("GetRoom", DataMemory.Rooms);
        //}

        //public async Task GetRoomById(Guid id)
        //{
        //    await Clients.Caller.SendAsync("GetRoomById", DataMemory.Rooms.FirstOrDefault(p => p.RoomId == id));

        //}

        //public async Task AddUser([FromBody] List<Guid> playerIds)
        //{
        //    var players = DataMemory.Users.Where(p => playerIds.Contains(p.PlayerId)).ToList();
        //    var romNew = new Room()
        //    {
        //        RoomId = Guid.NewGuid(),
        //        Players = new ConcurrentDictionary<Guid,Player>(),
        //    };
        //    foreach (var player in players)
        //    {
        //        romNew.Players.Add(player);
        //    }
        //    DataMemory.Rooms.Add(romNew);
        //    await Clients.Caller.SendAsync("GetRoomById", romNew);

        //}
       
        //public async Task AddToRoom(List<Guid> playerIds,Guid roomId)
        //{
        //    var players = DataMemory.Users.Where(p => playerIds.Contains(p.PlayerId)).ToList();
        //    var room  = DataMemory.Rooms.FirstOrDefault(s=>s.RoomId == roomId);
        //    foreach (var player in players)
        //    {
        //        room.Players.TryAdd(player);
        //    }
        //    await Clients.Caller.SendAsync("GetRoomById", room);
        //}
      
        //public Room RemoveFromRoom(List<Guid> playerIds, Guid roomId)
        //{
        //    var room = DataMemory.Rooms.FirstOrDefault(s => s.RoomId == roomId);
        //    foreach (var playerId in playerIds)
        //    {
        //        room.Players.TryRemove();
        //    }
            
        //    if(room.Players.Count == 0)
        //        DataMemory.Rooms.Remove(playerIds);
        //    return room;
        //}
        
    }
}
