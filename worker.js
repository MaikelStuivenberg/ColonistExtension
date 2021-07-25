// var socket = new WebSocket(this.socketURL);
// socket.onmessage = (ev) => {
//     console.log(ev);
// };

var ws = window.WebSocket;
window.WebSocket = function (a, b) {
  socket = new ws(a, b);

  socket.addEventListener('message', function (event) {
    var data = msgpack.deserialize(event.data);
    if (data.id == "60") {
      // Endgame data
      $.ajax('https://colonist.maikelstuivenberg.nl/post/endgame', {
        type: 'POST', data: JSON.stringify(data), dataType: 'json', contentType: 'application/json',
      });
    }
  });

  return socket;
}