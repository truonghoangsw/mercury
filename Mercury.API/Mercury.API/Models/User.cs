namespace Mercury.API.Models
{
    public class Clans
    {
        public Guid ClanId { get; set; }
        public List<Room> Rooms { get;set;}
    }
    public class Scores
    {
        public int PointInCurrentSet { get; set; }
        public int WinSet { get; set; }
        public Player Player { get; set; }
    }
    public class Room
    {
        public Guid RoomId { get; set; }
        public List<Player> Player { get; set; }
        public List<Scores> Scores { get; set; }
        public string GroupSocketId { get; set; }
    }
    public class Player
    {
        public string Name { get; set; }
        public string ConnectionId { get; set; }
        public Guid PlayerId { get; set; }
        public string GroupSocketId { get; set; }

    }
}
