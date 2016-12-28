var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  var msg = jQuery('[name=message]');
  if (msg.length>0) {
    var msgText = $.trim(msg.val());
    if (msgText.length>0) {
      msg.val('');
      socket.emit('createMessage', {
        from: 'User',
        text: msgText
      }, function () {

      });
    }
  }
  
});
