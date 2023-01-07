using Mercury.API.Models;
using System.Collections.Concurrent;

namespace Mercury.API.Data
{
    public  class DataMemory
    {
        public static List<Player> Users = new List<Player>();
        public static List<Room> Rooms = new List<Room>();
        public static List<Clans> Clans = new List<Clans>();
    }
}
