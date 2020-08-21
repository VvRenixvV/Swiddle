export default class Chat {
  constructor(socket) {

    let div = document.getElementById('chat-history');
    let chat = document.getElementById('list');
    let text = document.getElementById('text');
    let send = document.getElementById('sendMessage');

    send.onclick = function(e) {
      let data = text.value;
      let li = document.createElement('li');
      li.appendChild(document.createTextNode(data));
      chat.appendChild(li);
      socket.emit('newMsg', data);
      text.value = '';
      scrollDown();
    }

    socket.on('newMsg', function(data) {
      let li = document.createElement('li');
      li.appendChild(document.createTextNode(data));
      chat.appendChild(li);
      scrollDown();
    })

    function scrollDown() {
      div.scrollTop = div.scrollHeight;
    }
  }
}