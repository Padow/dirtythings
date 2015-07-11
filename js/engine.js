function Pickup() {
	
	this.config = {
		port : 8080,
		userkey : null
	};
	
	var $this = this;

	this.message = function(obj) {
		var el = document.createElement('p');
		if ('announcement' in obj)
			el.innerHTML = '<em>' + $this.esc(obj.announcement) + '</em>';
		else if ('message' in obj)
			el.innerHTML = '<b>' + $this.esc(obj.message[0]) + ':</b> ' + $this.esc(obj.message[1]);

		if( obj.message && window.console && console.log )
			console.log(obj.message[0], obj.message[1]);
		document.getElementById('chat').appendChild(el);
		document.getElementById('chat').scrollTop = 1000000;
	}

	this.send = function() {
		var val = document.getElementById('text').value;
		socket.send(val);
		$this.message({ message: ['you', val] });
		document.getElementById('text').value = '';
	}

	this.esc = function(msg) {
		return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	};

	var socket = new io.Socket(null, {
		port: $this.config.port,
		rememberTransport: false
	});
	
	this.run = function() {
		socket.connect();
	};

	socket.on('message', function(obj) {
		if ('buffer' in obj) {
			document.getElementById('form').style.display='block';
			document.getElementById('chat').innerHTML = '';

			for (var i in obj.buffer)
				$this.message(obj.buffer[i]);
		} else
			$this.message(obj);
	});
	socket.on('connect', function() {
		$this.message({ message: ['System', 'Connected']})
	});
	socket.on('disconnect', function() {
		$this.message({ message: ['System', 'Disconnected']})
	});
	socket.on('reconnect', function() {
		$this.message({ message: ['System', 'Reconnected to server']})
	});
	socket.on('reconnecting', function( nextRetry ) {
		$this.message({ message: ['System', 'Attempting to re-connect to the server, next attempt in ' + nextRetry + 'ms']})
	});
	socket.on('reconnect_failed', function() {
		$this.message({ message: ['System', 'Reconnected to server FAILED.']})
	});
	
	
}
