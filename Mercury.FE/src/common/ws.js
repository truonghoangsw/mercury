const ws = (function () {
  const {signalR} = window;
  const connection = new signalR.HubConnectionBuilder()
  .withUrl("ws://hackathon-2023-mercury.creativeforce-dev.io/socket", {
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets
  })
  .configureLogging(signalR.LogLevel.Information)
  .build();

  async function start() {
    try {
      await connection.start();
    } catch (err) {
      console.log(err);
      setTimeout(start, 5000);
    }
  }

  connection.onclose(async () => {
    await start();
  });

  start();

  return connection;
})();

export default ws;
