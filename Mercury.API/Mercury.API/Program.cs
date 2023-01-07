using Mercury.API.SignIrServices;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR().AddJsonProtocol(o =>
{
    o.PayloadSerializerOptions.PropertyNamingPolicy = null;
    
});
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.UseRouting();
app.MapHub<HubSockets>("/socket");
app.Run();
