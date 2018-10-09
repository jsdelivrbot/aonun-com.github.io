var ws=new WebSocket('ws://localhost')

ws.addEventListener('open', function (event) {

  ws.send(JSON.stringify({
  	name:$('#username').val(),
  	password:$('#password').val()
  }));

});

// Listen for messages
ws.addEventListener('message', function (event) {
    console.log('Message from server', event.data);
});

ws.addEventListener('close', function(event) {
	ws=new WebSocket('ws://localhost');

})