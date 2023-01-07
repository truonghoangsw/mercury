using Microsoft.AspNetCore.SignalR;

namespace Mercury.API.SignIrServices
{
    public class HubSockets : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
