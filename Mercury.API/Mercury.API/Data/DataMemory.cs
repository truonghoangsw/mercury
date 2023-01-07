using Mercury.API.Models;
using System.Collections.Concurrent;

namespace Mercury.API.Data
{
    public  class DataMemory
    {
        static ConcurrentBag<User> Users = new ConcurrentBag<User>();
        static ConcurrentBag<Room> Rooms = new ConcurrentBag<Room>();
        static ConcurrentBag<Clans> Clans = new ConcurrentBag<Clans>();
    }
}
