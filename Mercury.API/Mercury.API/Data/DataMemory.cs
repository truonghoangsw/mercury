using Mercury.API.Models;
using System.Collections.Concurrent;

namespace Mercury.API.Data
{
    public static class DataMemory
    {
        public static ConcurrentDictionary<Guid,Player> Users = new ConcurrentDictionary<Guid, Player>();
        public static ConcurrentDictionary<Guid, Room> Rooms = new ConcurrentDictionary<Guid, Room>();
    }
}
