namespace Mercury.API.Models
{
    public class Clans
    {
        public Guid ClanId { get; set; }
        public List<Room> Rooms { get;set;}
    }
    public class Scores
    {
    }
    public class Room
    {
        public Guid RoomId { get; set; }
        public List<User> Users { get; set; }
        public List<Scores> Scores { get; set; }
    }
    public class User
    {
        public string Name { get; set; }
        public Guid UserId { get; set; }
    }
}
