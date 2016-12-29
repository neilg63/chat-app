var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  li.text(`${message.from} (${formattedTime}): ${message.text}`);

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>'), a = $('<a target="_blank">My current location</a>')
  a.attr('href', message.url);
  li.text(message.from + '('+formattedTime+'):');
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
  var msgTextbox = jQuery('[name=message]');
  if (msgTextbox.length>0) {
    var msgText = $.trim(msgTextbox.val());
    if (msgText.length>0) {
      socket.emit('createMessage', {
        from: 'User',
        text: msgText
      }, function () {
        msgTextbox.val('');
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
    locationButton.attr('disabled', true);

    navigator.geolocation.getCurrentPosition(function (position) {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      locationButton.attr('disabled', false);
    },function() {
      locationButton.attr('disabled', false);
    });
  });
}
