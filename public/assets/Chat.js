export default class Chat {
  constructor(socket) {

    let chat = document.getElementById('chat-history');
    let text = document.getElementById('text');
    let send = document.getElementById('sendMessage');

    send.onclick = function(e) {
      let data = text.value;
      let li = document.createElement('li');
      li.appendChild(document.createTextNode(data));
      chat.appendChild(li);
      socket.emit('newMsg', data);
      text.value = '';
    }

    socket.on('newMsg', function(data) {
      let li = document.createElement('li');
      li.appendChild(document.createTextNode(data));
      chat.appendChild(li);
    })
  }
}