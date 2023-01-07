using Mercury.API.Models;
using System.Collections.Concurrent;

namespace Mercury.API.Data
{
    public  class DataMemory
    {
        public static ConcurrentBag<Player> Users = new ConcurrentBag<Player>();
        public static ConcurrentBag<Room> Rooms = new ConcurrentBag<Room>();
        public static ConcurrentBag<Clans> Clans = new ConcurrentBag<Clans>();
    }
}
