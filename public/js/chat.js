var socket = io();

function scrollToBottom() {
  var messages = jQuery('#messages'),
  newMessage = messages.children('li:last-child'),
  clientHeight = messages.prop('clientHeight'),
  scrollTop = messages.prop('scrollTop'),
  scrollHeight = messages.prop('scrollHeight'),
  newMessageHeight = newMessage.innerHeight(),
  lastMessageHeight = newMessage.prev().innerHeight();
  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  var params = jQuery.deparam();

  socket.emit('join',params, function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log(params.room)
    }
  });

});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#message-template').html();
  var html = Mustache.render(template,{
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
   var template = $('#location-message-template').html();
  var html = Mustache.render(template,{
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
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


