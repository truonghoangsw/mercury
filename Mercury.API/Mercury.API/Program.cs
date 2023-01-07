using Mercury.API.SignIrServices;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSignalR().AddJsonProtocol(o =>
{
    o.PayloadSerializerOptions.PropertyNamingPolicy = null;
    
});
var app = builder.Build();

app.UseAuthorization();
app.UseRouting();
app.MapHub<HubSockets>("/socket");
app.Run();
