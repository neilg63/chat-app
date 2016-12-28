var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>'), a = $('<a target="_blank">My current location</a>')
  a.attr('href', message.url);
  li.text(message.from + ':');
  li.append(a);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (e) {
  
  var li = jQuery('<li><a href=""></a></li>');
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

var locationButton = jQuery('#send-location');

if (locationButton.length>0) {
  locationButton.on('click', function(e){
    e.preventDefault();
    if (!navigator.geolocation) {
      return alert("No geolocation available");
    }

    navigator.geolocation.getCurrentPosition(function (position) {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },function() {

    });
  });
}
