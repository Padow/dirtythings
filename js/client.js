(function($){
	// connexion au socket (ip du serveur)
	var socket = io.connect('http://127.0.0.1:1337');
	var msgtpl = $('#msgtpl').html();
	$('#msgtpl').empty();
	var pcktpl = $('#pickup-team').html();
	$('#pickup-team').empty();
	var lastmsg = false;
	var ready = false;

/************************
*	Event client side	*
*************************/

	// on récuper les infos de session une fois la page chargé
	$(window).ready(function(){
		// console.log($('#username').val());
		// si l'utilisateur est loggé on l'ajoute à la liste des connectés
		if ($('#username').val()) {
			socket.emit('login', {
				username : $('#username').val(),
				id : $('#userid').val(),
				role : $('#userrole').val(),
				avatar : $('#avatar').val(),
			});
		}
	});

	$('#testing').click(function() {
		alert($('.ready-countdown').html());

	});

	socket.on('testcallback', function(testmes){
		alert(testmes);
	});



	//event selection des slots
	$('#select-scout').click(function() {
		socket.emit('select-scout', {
			type : 'scout',
			mapname : $('#vote_map :selected').text(),
			mappic : $('#vote_map :selected').val() 
		})
	});

	$('#select-soldier').click(function() {
		socket.emit('select-soldier', {
			type : 'soldier',
			mapname : $('#vote_map :selected').text(),
			mappic : $('#vote_map :selected').val() 
		})
	});

	$('#select-demo').click(function() {
		socket.emit('select-demo', {
			type : 'demo',
			mapname : $('#vote_map :selected').text(),
			mappic : $('#vote_map :selected').val() 
		})
	});

	/**
			Ready part
	*/
	$('.countdown.callback').countdown({
              date: +(new Date) + 0,
              render: function(data) {
                $('.ready-countdown').empty();
                $('.ready-countdown').append(('0'+data.min).slice(-2)+':'+('0'+data.sec).slice(-2));
                if(data.min == 0 && data.sec == 0){
                	ready = false;
                	socket.emit('unsetready');
                	$('.ready-countdown').empty();
                }
              },
              onEnd: function() {
                $(this.el).addClass('ended');
              }
            }).on("click", function() {
            	if($('.ready-countdown').html()){
            		ready = false;
                	socket.emit('unsetready');
                	$('.ready-countdown').empty();
                	$(this).addClass('ended').data('countdown').update(+(new Date) + 0);
            	}else{
					ready = true;
					$(this).removeClass('ended').data('countdown').update(+(new Date) + 180000).start();
					socket.emit('setready');
          		}
    });

	$('#ready-pickup').click(function() {
		// socket.emit('setready');
		// $('#timerpick').fadeIn(400);
	});

	$('#select-medic').click(function() {
		socket.emit('select-medic', {
			type : 'medic',
			mapname : $('#vote_map :selected').text(),
			mappic : $('#vote_map :selected').val() 
		})
	});

	$('#quit-pickup').click(function() {
		socket.emit('quit-pickup', {})
	});

	// envoi d'un message
	$('#chat-form').submit(function( event ){
		event.preventDefault();
		socket.emit('newmsg', { message : $('#input-message').val() });
		$('#input-message').val('');
		$('#input-message').css("box-shadow","none");
		$('#input-message').focus();
	});

	// votemap
	$('#vote_map').on('change', function() {
		socket.emit('votemap', {
			mapname : $('#vote_map :selected').text(),
			mappic : $('#vote_map :selected').val() 
		})
	});




/************************
*	Event server side	*
*************************/
	function clearslot(id){
		// on vide tous les éléménent (html) content le joueur
			$('.idt'+id).css("border-left", "4px solid #DBDAD4");
			$('.scout-' + id).empty();
			// et on les passent en libre
			$('.scout-' + id).addClass('free-scout').removeClass('scout-' + id + ' idt' + id);
			$('.soldier-' + id).empty();
			$('.soldier-' + id).addClass('free-soldier').removeClass('soldier-' + id + ' idt' + id);
			$('.demo-' + id).empty();
			$('.demo-' + id).addClass('free-demo').removeClass('demo-' + id + ' idt' + id);
			$('.medic-' + id).empty();
			$('.medic-' + id).addClass('free-medic').removeClass('medic-' + id + ' idt' + id);
			

	}

	// ferme la fenetre si on ré-ouvre le pickup (ne fonctionne pas sur mozilla)
	socket.on('closewin', function() {
		self.close();
	});

	// averti qu'une fenêtre pickup est déjà ouverte pour mozilla
	socket.on('refresh', function() {
		alert('le pickup est déjà ouvert dans un autre onglet.');
	})

	// affichage des utilisateurs connectés dans la liste
	socket.on('newusr', function(user){
		if (user.role == "admin") {
			$('#admin-list').append('<li id="' + user.id + '"><a href="../user/profil/view/id/' + user.id + '" target="_blank" class="users-list admin"><span>' + user.username + '</span></a></li>');
		}else{
			$('#users-list').append('<li id="' + user.id + '"><a href="../user/profil/view/id/' + user.id + '" target="_blank" class="users-list"><span>' + user.username + '</span></a></li>');
		}
		
	});

	socket.on('nbusers', function(nbusers){
		$('#nbusers').empty();
		$('#nbusers').append(nbusers);
	});


	// affichage du nombre de slots occupés des différent classe
	socket.on('nbscout', function(nbscout){
		$('.count-scout').empty();
		$('.count-scout').append(nbscout.length);
		$('.left-scout').empty();
		if(4-nbscout.length > 0)
			$('.left-scout').append(4-nbscout.length +'X<img src="http://localhost/tf2connexion/skin/pickup/css/classes/scout_2.png">&nbsp');
		
	});
	socket.on('nbsoldier', function(nbsoldier){
		$('.count-soldier').empty();
		$('.count-soldier').append(nbsoldier.length);
		$('.left-soldier').empty();
		if(4-nbsoldier.length > 0)
			$('.left-soldier').append(4-nbsoldier.length +'X<img src="http://localhost/tf2connexion/skin/pickup/css/classes/soldier_2.png">&nbsp');
		
	});
	socket.on('nbdemo', function(nbdemo){
		$('.count-demo').empty();
		$('.count-demo').append(nbdemo.length);
		$('.left-demo').empty();
		if(2-nbdemo.length > 0)
			$('.left-demo').append(2-nbdemo.length +'X<img src="http://localhost/tf2connexion/skin/pickup/css/classes/demo_2.png">&nbsp');
	});
	socket.on('nbmedic', function(nbmedic){
		$('.count-medic').empty();
		$('.count-medic').append(nbmedic.length);
		$('.left-medic').empty();
		if(2-nbmedic.length > 0)
			$('.left-medic').append(2-nbmedic.length +'X<img src="http://localhost/tf2connexion/skin/pickup/css/classes/medic_2.png">&nbsp');
		
	});
	socket.on('nbpickup', function(nbpickup){
		$('#count-inpickup').empty();
		$('#count-inpickup').append('<h2>Joueur : ' + nbpickup + ' sur 12</h2>');
	});

	// affichage du nom du joueur dans les slots
	socket.on('newpck', function(user){
		// console.log(user);
		// on recupert le type de la class du joueur (user)
		if (user.type == 'scout') {
			clearslot(user.id);
			// on ajoute le nom du joueur dans le premier slot libre de la classe
			$('.free-scout:first').first().append('<img class="pickup-avatar" src="'+ user.avatar +'" > '+user.username);
			// on passe l'element non libre 
			$('.free-scout:first').first().removeClass('free-scout').addClass('scout-'+user.id + ' idt' + user.id);
			if(ready)
				socket.emit('setready');
		}

		if (user.type == 'soldier') {
			clearslot(user.id);			
			$('.free-soldier:first').first().append('<img class="pickup-avatar" src="'+ user.avatar +'" > '+user.username);
			$('.free-soldier:first').first().removeClass('free-soldier').addClass('soldier-'+user.id + ' idt' + user.id);
			if(ready)
				socket.emit('setready');

		};

		if (user.type == 'demo') {
			clearslot(user.id);			
			$('.free-demo:first').first().append('<img class="pickup-avatar" src="'+ user.avatar +'" > '+user.username);
			$('.free-demo:first').first().removeClass('free-demo').addClass('demo-'+user.id + ' idt' + user.id);
			if(ready)
				socket.emit('setready');	

		};

		if (user.type == 'medic') {
			clearslot(user.id);			
			$('.free-medic:first').first().append('<img class="pickup-avatar" src="'+ user.avatar +'" > '+user.username);
			$('.free-medic:first').first().removeClass('free-medic').addClass('medic-'+user.id + ' idt' + user.id);
			if(ready)
				socket.emit('setready');

		};
	});

	// affichage des messages du bot pickup
	socket.on('pickup-message', function(message){
		$('#pickup-message').empty();
		$('#pickup-message').append(message);
		setTimeout(function() {
		    $('#pickup-message').empty();
		}, 2000);
	});

	// affichage des éléments pour les joueurs inscrit dans le pickup
	socket.on('in-pickup', function(){
		$('#in-pickup').fadeIn(400);
	});

	// alert audio quand le pickup atteind 11 joueurs
	socket.on('displayaudioalert',function(){
		var audio = new Audio('../skin/pickup/sounds/attention.mp3');
		audio.play();
	});

	// on masque les éléments pour les joueurs qui quitte le pickup
	socket.on('hide-in-pickup', function(){
		$('#vote_map').val('map');
		$('#in-pickup').fadeOut(400);
	});

	// On libert le slot du joueur qui quitte
	socket.on('user-quit', function(user){
		clearslot(user.id);
	});

	// affichage des votes map
	socket.on('votemapres', function(maps){
		$('#map-result').empty();
		var mapcount = [];
		// console.log('maps');
		for(var k in maps){
			mapcount.push(maps[k].mappic);
			// mapcount.push(maps[k].mapname);
		}
		mapcount.sort();
		
		var tt = {};
		var lastmap = false;
		for(var k in mapcount){
			if(lastmap != mapcount[k]){
				tt[mapcount[k]] = 1;
				lastmap = mapcount[k];
			}else{
				tt[mapcount[k]] = tt[mapcount[k]] + 1;
			}
		}
		// console.log(tt);
		var temp = [];
		$.each(tt, function(key, value) {
		    temp.push({v:value, k: key});
		});
		temp.sort(function(a,b){
		   if(a.v < b.v){ return 1}
		    if(a.v > b.v){ return -1}
		      return 0;
		});
		var cpt = 0;
		var count = -1;
		$.each(temp, function(key, obj) {
			var mapname = obj.k;
			var name = mapname.split('.');
			if(cpt == 0){
				count = obj.v;
				$('#map-result').append('<div class="map-pic"><img src="/tf2connexion/skin/pickup/css/maps/'+ obj.k +'" alt="' + obj.k + '"/> X'+ obj.v +'<p class="map-name">' + name[0] + '</p></div>');
			}
			if(cpt > 0 && cpt < 3 ){
				if(count == obj.v){
					$('#map-result').append('<div class="map-pic"><img src="/tf2connexion/skin/pickup/css/maps/'+ obj.k +'" alt="' + obj.k + '"/> X'+ obj.v +'<p class="map-name">' + name[0] + '</p></div>');
				}else{
					$('#map-result').append('<img class="small-pic" src="/tf2connexion/skin/pickup/css/maps/'+ obj.k +'" alt="' + obj.k + '"/> X '+ obj.v +'<p class="map-name-small">' + name[0] + '</p> ');
				}
			}
			if(cpt > 2){
				$('#map-result').append('<p>' + name[0] + ' ' + 'X' + obj.v + '</p>');
			}
				

			cpt++;
		});

	});

	socket.on('votemappick', function(maps){
		var mapcount = [];
		// console.log(maps);
		for(var k in maps){
			mapcount.push(maps[k].mapname);
		}
		mapcount.sort();
		var tt = {};
		var lastmap = false;
		for(var k in mapcount){
			if(lastmap != mapcount[k]){
				tt[mapcount[k]] = 1;
				lastmap = mapcount[k];
			}else{
				tt[mapcount[k]] = tt[mapcount[k]] + 1;
			}
		}
		var temp = [];
		$.each(tt, function(key, value) {
		    temp.push({v:value, k: key});
		});
		temp.sort(function(a,b){
		   if(a.v < b.v){ return 1}
		    if(a.v > b.v){ return -1}
		      return 0;
		});
		var cpt = 0;

		$.each(temp, function(key, obj) {
			if(cpt == 0){
				$('#map-pick').empty();
				$('#map-pick').append('<span>Map : ' + obj.k + '</span>');
			}
			cpt++;
		});

	});

	socket.on('pickupfullnew', function(){
		$('#pickup-status').empty();
		$('#pickup-status').append('<h1>Pickup status : en attente de validation des joueurs <span class="time-left-to-ready"></span></h1>');
	});

	socket.on('searchServ', function(){
		$('#pickup-status').empty();
		$('#pickup-status').append('<h1>Pickup status : recherche de serveur</h1>');
	});

	socket.on('pickupfullalert', function(users){
		$('#pickup-status').empty();
		$('#pickup-status').append('<h1>Pickup status : en attente de validation des joueurs <span class="time-left-to-ready"></span></h1>');
		for(var k in users){
			if($('#username').val() == k){
				var audio = new Audio('../skin/pickup/sounds/announcer_begins_30sec.mp3');
				audio.play();
			}
		}
	})

	socket.on('pickupfull', function(){
		socket.emit('countdownready');
	});

	
	socket.on('timer', function (data) {
		$('.time-left-to-ready').html(data.countdown);
	});

	socket.on('pickupnotfull', function(){
		$('#pickup-status').empty();
		$('#pickup-status').append("<h1>Pickup status : en attente de joueurs</h1>");
	});

	socket.on('ServerError', function(){
		alert('Pas de serveur dispo');
	});
 
 	//ready part
	socket.on('isready', function(me){
		$('.idt'+me.id).css("border-left", "4px solid #2A0");	
	});

	socket.on('isntready', function(me){
		$('.idt'+me.id).css("border-left", "4px solid #DBDAD4");
	});



	// reception d'un message
	socket.on('newmsg', function(message){
		if(lastmsg != message.user.id){
			$('#chat-box').append('<div class="sep"></div>');
			lastmsg = message.user.id;
		}
		if (message.user.role == "admin") {
			$('#chat-box').append('<div class="message-admin">' + Mustache.render(msgtpl, message) + '</div><div class="sepsame"></div>');
		}else{
			$('#chat-box').append('<div class="message">' + Mustache.render(msgtpl, message) + '</div><div class="sepsame"></div>');
		}
		
		$('#chat-box').animate({scrollTop : $('#chat-box').prop('scrollHeight')}, 500);
	});

	// pickup ce lance
	socket.on('pickupstart', function(bluteam, redteam, chosenmap, connectLink){
		var torend = {'bluteam': bluteam, 'redteam': redteam, 'chosenmap': chosenmap, 'server': connectLink};
		$('#pickup-team').append(Mustache.render(pcktpl, torend));
		
	});

	socket.on('launchGame', function(connectLink){
		document.location = connectLink;
	});

	// Quant un joueur quitte la page
	socket.on('disusr', function(user){
		$('#' + user.id).remove();
		$('.scout-' + user.id).empty();
		$('.scout-' + user.id).addClass('free-scout').removeClass('scout-'+user.id);
		$('.soldier-' + user.id).empty();
		$('.soldier-' + user.id).addClass('free-soldier').removeClass('soldier-'+user.id);
		$('.demo-' + user.id).empty();
		$('.demo-' + user.id).addClass('free-demo').removeClass('demo-'+user.id);
		$('.medic-' + user.id).empty();
		$('.medic-' + user.id).addClass('free-medic').removeClass('medic-'+user.id);
		$('.idt'+user.id).css("border-left", "4px solid #DBDAD4");
	});


})(jQuery);
