var http = require('http');

httpServer = http.createServer(function(req, res){
    res.writeHead(200, {'content-type': 'text/plain'});
    res.end('hello world');
});
httpServer.listen(1337);
console.log('Server running at http://0.0.0.0:1337/');
var io = require('socket.io').listen(httpServer);

/**
    connexion SQL
**/

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'toor',
  database : 'tf2connexion'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

/**
    connexion serveur TF2
**/
var ssq = require('ssq');
var Rcon = require('srcds-rcon/lib/Rcon.js');

var users = {};
var inpickup = {};
var nbscout = [];
var nbsoldier = [];
var nbdemo = [];
var nbmedic = [];
var readytopickup = [];

var use = 0;

var maps = [];

var messages = [];
var history = 5;
/**

    Populate
    
**/
/**

var map1 = {
            mapname : 'CP_Snakewater',
            mappic : 'snakewater.png'
}

var map2 = {
            mapname : 'CP_Process',
            mappic : 'process.jpg'
}

var map3 = {
            mapname : 'CP_Granary',
            mappic : 'granary.jpg'
}

var map4 = {
            mapname : 'CP_badland',
            mappic : 'badlands.jpg'
}

var map4 = {
            mapname : 'PL_badwater',
            mappic : 'badwater.jpg'
}

var map5 = {
            mapname : 'koth_pro_viaduct_rc4',
            mappic : 'koth_pro_viaduct_rc4.png'
}



var test = {
            username : 'Medico',
            id : '123',
            role : 'joueur',
            type : 'medic',
            skill : '1',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };

var test2 = {
            username : 'Dr House',
            id : '1223',
            role : 'joueur',
            type : 'medic',
            skill : '6',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };

users[test.username] = test;
inpickup[test.username] = test;
nbmedic.push(test.username);

users[test2.username] = test2;
inpickup[test2.username] = test2;
nbmedic.push(test2.username);



var scout1 = {
            username : 'Fl1p',
            id : '1231',
            role : 'admin',
            type : 'scout',
            skill : '5',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };

var scout2 = {
            username : 'gf18',
            id : '1232',
            role : 'joueur',
            type : 'scout',
            skill : '2',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };

var scout3 = {
            username : 'Captain Etienne',
            id : '1233',
            role : 'joueur',
            type : 'scout',
            skill : '4',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };
var scout4 = {
            username : 'Patey',
            id : '1234',
            role : 'joueur',
            type : 'scout',
            skill : '6',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };
var scout5 = {
            username : 'scout5',
            id : '12345',
            role : 'joueur',
            type : 'scout',
            skill : '6',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };

var scout6 = {
            username : 'scout6',
            id : '12346',
            role : 'joueur',
            type : 'scout',
            skill : '6',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };
var scout7 = {
            username : 'scout7',
            id : '12347',
            role : 'joueur',
            type : 'scout',
            skill : '6',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };
var scout8 = {
            username : 'scout8',
            id : '12348',
            role : 'joueur',
            type : 'scout',
            skill : '6',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };
var scout9 = {
            username : 'scout9',
            id : '12348',
            role : 'joueur',
            type : 'scout',
            skill : '6',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };

// for(var i = 0; i< 100; i++){
//     var bob = {
//             username : 'bob'+i,
//             id : '512348'+i,
//             role : 'joueur',
//             type : 'scout',
//             skill : '6',
//             avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
//             sktid : ''
//         };
//     users[bob.username] = bob;
// }


users[scout1.username] = scout1;
users[scout2.username] = scout2;
users[scout3.username] = scout3;
users[scout4.username] = scout4;
users[scout5.username] = scout5;
users[scout6.username] = scout6;
users[scout7.username] = scout7;
users[scout8.username] = scout8;
users[scout9.username] = scout9;

inpickup[scout1.username] = scout1;
inpickup[scout2.username] = scout2;
inpickup[scout3.username] = scout3;
inpickup[scout4.username] = scout4;

nbscout.push(scout1.username);
nbscout.push(scout2.username);
nbscout.push(scout3.username);
nbscout.push(scout4.username);

var soldier1 = {
            username : 'Keyro',
            id : '21231',
            role : 'joueur',
            type : 'soldier',
            skill : '2',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };

var soldier2 = {
            username : 'Plapla',
            id : '21232',
            role : 'joueur',
            type : 'soldier',
            skill : '1',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };

var soldier3 = {
            username : 'Tek',
            id : '21233',
            role : 'joueur',
            type : 'soldier',
            skill : '6',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };
var soldier4 = {
            username : 'Shog',
            id : '21234',
            role : 'joueur',
            type : 'soldier',
            skill : '6',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };

var demo1 = {
            username : 'demo1',
            id : '211234',
            role : 'joueur',
            type : 'demo',
            skill : '6',
            avatar : '/tf2connexion/media/images/cache/avatar/40x40/8de74f3325d86da7fdf4fda35ba0fd2f.jpg',
            sktid : ''
        };

users[demo1.username] = demo1;
users[soldier1.username] = soldier1;
users[soldier2.username] = soldier2;
users[soldier3.username] = soldier3;
users[soldier4.username] = soldier4;

inpickup[demo1.username] = demo1;
inpickup[soldier1.username] = soldier1;
inpickup[soldier2.username] = soldier2;
inpickup[soldier3.username] = soldier3;
inpickup[soldier4.username] = soldier4;

nbdemo.push(demo1.username);
nbsoldier.push(soldier1.username);
nbsoldier.push(soldier2.username);
nbsoldier.push(soldier3.username);
nbsoldier.push(soldier4.username);


map1.user = soldier1.username;
map2.user = soldier2.username;
map3.user = soldier3.username;
map4.user = soldier4.username;

map5.user = scout3.username;
// maps.push(map1);
// maps.push(map2);
// maps.push(map3);
// maps.push(map4);
// maps.push(map5);


readytopickup.push(demo1.username);
readytopickup.push(soldier1.username);
readytopickup.push(soldier2.username);
readytopickup.push(soldier3.username);
readytopickup.push(soldier4.username);
readytopickup.push(scout1.username);
readytopickup.push(scout2.username);
readytopickup.push(scout3.username);
readytopickup.push(scout4.username);
readytopickup.push(test.username);
readytopickup.push(test2.username);

**/

io.sockets.on('connection', function(socket){


    /**
        Function 

    */
    function removefrompick(name){
        // supprime le joueur du pickup
        delete inpickup[name];
        // décrément le compteur de slot des classes
        for(var k in nbscout){
            if(nbscout[k] == name){
                nbscout.splice(k, 1);
            }
        }
        for(var k in nbsoldier){
            if(nbsoldier[k] == name){
                nbsoldier.splice(k, 1);
            }
        }
        for(var k in nbdemo){
            if(nbdemo[k] == name){
                nbdemo.splice(k, 1);
            }
        }
        for(var k in nbmedic){
            if(nbmedic[k] == name){
                nbmedic.splice(k, 1);
            }
        }

        for(var k in maps){
            if(maps[k].user == name){
                maps.splice(k, 10);
            }
        }

        delete inpickup[name];
    }

    function clearpick(){
        // supprime le joueur du pickup
        delete inpickup[me.username];
        // décrément le compteur de slot des classes
        for(var k in nbscout){
            if(nbscout[k] == me.username){
                nbscout.splice(k, 1);
            }
        }
        for(var k in nbsoldier){
            if(nbsoldier[k] == me.username){
                nbsoldier.splice(k, 1);
            }
        }
        for(var k in nbdemo){
            if(nbdemo[k] == me.username){
                nbdemo.splice(k, 1);
            }
        }
        for(var k in nbmedic){
            if(nbmedic[k] == me.username){
                nbmedic.splice(k, 1);
            }
        }
    }

    function clearReady(){
        for(var k in readytopickup){
            if(readytopickup[k] == me.username){
                readytopickup.splice(k, 10);
            }
        }
    }

    function votemap(map){
        var pickupkey = Object.keys(inpickup);
        // si le client est inscrit au pickup
        if(pickupkey.indexOf(me.username) != -1){    
            map.user = me.username;
            // supprime le vote précédent du client
            for(var k in maps){
                if(maps[k].user == me.username){
                    maps.splice(k, 10);
                }
            }
            // si la map à un nom
            if(map.mappic != 'map'){
                // si le client est médic un vote supplementaire
                if(nbmedic.indexOf(me.username) != -1){
                    maps.push(map);
                }
                // vote supplémentaire (si avantage) du client
                for(var i = 0; i <= me.vote-1; i++){
                    maps.push(map);
                }
                maps.push(map);
            }
            
            io.sockets.emit('votemapres', maps);
        }
    }

    var message = false;
    var me = false;

    // ajoute le joueur dans la table pickup_skills
    function insertskill(me){
        var queryString = 'INSERT INTO pickup_skills (id_user) VALUES (' + me.id + ')';
            connection.query(queryString, function(err, rows, fields) {
                if (err) throw err;
            });
    }

    // recupere le skill du joueur pour chaque classe et le vote supp
    function query(me){
        var queryString = 'SELECT * FROM pickup_skills where id_user = '+me.id;
        connection.query(queryString, function(err, rows, fields) {
            if (err) throw err;
            if(rows.length != 0){
                me.skillsoldier = rows[0].soldier_skill;
                me.skillscout = rows[0].scout_skill;
                me.skilldemo = rows[0].demo_skill;
                me.skillmedic = rows[0].medic_skill;
                me.vote = rows[0].vote_supp;
            }else{
                me.skillsoldier = 6;
                me.skillscout = 6;
                me.skilldemo = 6;
                me.skillmedic = 6;
                me.vote = 0;
                insertskill(me);
            }
        });
        return me;
    }

    // console.log('new user');
    // fonction de login au chargement
    /*
    *   si le nom de l'utilisateur existe déjà dans la variable 'users'
    *   (si la fenêtre pickup est ouvert 2 fois par l'utilisateur)
    *       on ferme la fenêtre - ne fonctionne pas sous FF
    *           -> hack pour FF on repasse 'me' à 'false'
    *   Sinon on ajout l'utilisateur à la variable
    *   et on informe tous les autres utilisateur
    */
    socket.on('login', function(user){
        me = user;
        
        // console.log('login');
        if(!users[me.username]){
                me = query(me);
                me.sktid = socket.id;

                users[me.username] = me;         
                var userskey = Object.keys(users);
                io.sockets.emit('nbusers', userskey.length);
                io.sockets.emit('newusr', me);
        }else{
            // récupération de clées de users
            me = false;
            socket.emit('closewin');
        }
    });

    // récupération de clées de users
    var keys = Object.keys(users);
    // tri les clées obtenues 
    keys.sort();
    // informe le nouveau client des users connectés
    for(var k in keys){
        socket.emit('newusr', users[keys[k]]);
    }

    // informe le nouveau client du nombre de  joueur inscrit au pickup
    var pickupkey = Object.keys(inpickup);
    socket.emit('nbpickup', pickupkey.length);

    var userskey = Object.keys(users);
    // console.log(userskey.length);
    socket.emit('nbusers', userskey.length);

    // informe le nouveau client des inscrits au pickup 
    // console.log(inpickup);
    for(var k in inpickup){
        socket.emit('newpck', inpickup[k]);
    }

    // informe le nouveau client des joueur ready
    for(var k in readytopickup){
       socket.emit('isready', inpickup[readytopickup[k]]);
       // console.log([readytopickup[k]);
    }


    // informe le nouveau client du nombre de slot pris par classe
    socket.emit('nbscout', nbscout);
    socket.emit('nbsoldier', nbsoldier);
    socket.emit('nbdemo', nbdemo);
    socket.emit('nbmedic', nbmedic);

    // affichage du status
    var pickupkeys = Object.keys(inpickup);
    if(pickupkeys.length > 11)
        io.sockets.emit('pickupfullnew');
    else
        io.sockets.emit('pickupnotfull');

    // informe le nouveau client du votemap
    socket.emit('votemapres', maps);
    // socket.emit('votemappick', maps);

    // affichage historic mess
    for(var k in messages){
        socket.emit('newmsg', messages[k]);  
    }


/*
*   sélection des classes
*/
    socket.on('select-scout', function(user){
        /*
        *   si 'me' retourn false (2eme fenetre avec FF)
        *   on informe le client
        *   sinon on fait le traitement
        */
        
        if(me){
            // si le client est déjà scout
            if(nbscout.indexOf(me.username) != -1){
                return false;
            }
            // vérification de la limite des slots
            if(nbscout.length > 3){
                // si les slots sont plein on informe le client
                // et on stop la fonction
                var message = "Tous les slots scout sont déjà pris.";
                socket.emit('pickup-message', message);
                return false;
            }
            var map = {};
            map.mapname = user.mapname;  
            map.mappic = user.mappic;  
          
            var scout = user;
            scout.username = me.username;
            scout.id = me.id;
            scout.skill = me.skillscout;
            scout.vote = me.vote;
            scout.avatar = me.avatar;
            scout.sktid = me.sktid;
            // liste des joueur dans le pickup
            var oldpickupkey = Object.keys(inpickup);

            clearpick();

            // ajout du joueur au nombre de scout
            nbscout.push(me.username);
            // ajout du joueur au pickup
            inpickup[scout.username] = scout;
            var pickupkey = Object.keys(inpickup);
            // si le nombre de joueur est égal à 11 et si il nétait pas déjà dans le pickup
            if(pickupkey.length == 11 && oldpickupkey.indexOf(me.username) == -1){
                //on informe tous les client
                io.sockets.emit('displayaudioalert');
            }
            if(pickupkey.length == 12){
                socket.emit('pickupfull');
                io.sockets.emit('pickupfullalert', inpickup);
            }
            // envois des info au client
            // nombre de joueur dans le pickup
            
            io.sockets.emit('nbpickup', pickupkey.length);
            
            // affichage des votes
            votemap(map);  
            // permet l'affichage des options quitter, votemap
            socket.emit('in-pickup');
            // mise à jour des compteur des différente classes
            io.sockets.emit('newpck', scout);
            io.sockets.emit('nbscout', nbscout);
            io.sockets.emit('nbsoldier', nbsoldier);
            io.sockets.emit('nbdemo', nbdemo);
            io.sockets.emit('nbmedic', nbmedic);
        }else{
            socket.emit('refresh');
        } 
    });

    socket.on('select-soldier', function(user){
        if(me){
            if(nbsoldier.indexOf(me.username) != -1){
                return false;
            }
            if(nbsoldier.length > 3){
                var message = "Tous les slots soldier sont déjà pris.";
                socket.emit('pickup-message', message);
                return false;
            }
            var map = {};
            map.mapname = user.mapname;  
            map.mappic = user.mappic;  
             
            var soldier = user;
            soldier.username = me.username;
            soldier.id = me.id;
            soldier.skill = me.skillsoldier;
            soldier.vote = me.vote;
            soldier.avatar = me.avatar;
            soldier.sktid = me.sktid;
            var oldpickupkey = Object.keys(inpickup);
            clearpick();
            
            nbsoldier.push(me.username);
            inpickup[soldier.username] = soldier;
            var pickupkey = Object.keys(inpickup);
            if(pickupkey.length == 11 && oldpickupkey.indexOf(me.username) == -1){
                io.sockets.emit('displayaudioalert');
            }
            if(pickupkey.length == 12){
                socket.emit('pickupfull');
                io.sockets.emit('pickupfullalert', inpickup);
            }
            votemap(map);
            io.sockets.emit('nbpickup', pickupkey.length);
            socket.emit('in-pickup');
            io.sockets.emit('newpck', soldier);
            io.sockets.emit('nbscout', nbscout);
            io.sockets.emit('nbsoldier', nbsoldier);
            io.sockets.emit('nbdemo', nbdemo);
            io.sockets.emit('nbmedic', nbmedic);
        }else{
            socket.emit('refresh');
        }
    });

    socket.on('select-demo', function(user){
        if(me){
            if(nbdemo.indexOf(me.username) != -1){
                return false;
            }
             if(nbdemo.length > 1){
                var message = "Tous les slots demo sont déjà pris.";
                socket.emit('pickup-message', message);
                return false;
            }
            var map = {};
            map.mapname = user.mapname;  
            map.mappic = user.mappic;  
               
            var demo = user;
            demo.username = me.username;
            demo.id = me.id;
            demo.skill = me.skilldemo;
            demo.vote = me.vote;
            demo.avatar = me.avatar;
            demo.sktid = me.sktid;
            var oldpickupkey = Object.keys(inpickup);
            clearpick();
           
            nbdemo.push(me.username);
            inpickup[demo.username] = demo;
            var pickupkey = Object.keys(inpickup);
            if(pickupkey.length == 11 && oldpickupkey.indexOf(me.username) == -1){
                io.sockets.emit('displayaudioalert');
            }
            if(pickupkey.length == 12){
                socket.emit('pickupfull');
                io.sockets.emit('pickupfullalert', inpickup);
            }

            votemap(map);
            io.sockets.emit('nbpickup', pickupkey.length);
            socket.emit('in-pickup');
            io.sockets.emit('newpck', demo);
            io.sockets.emit('nbscout', nbscout);
            io.sockets.emit('nbsoldier', nbsoldier);
            io.sockets.emit('nbdemo', nbdemo);
            io.sockets.emit('nbmedic', nbmedic);
        }else{
            socket.emit('refresh');
        }
    });
    
    socket.on('select-medic', function(user){
        
        if(me){
            // console.log(nbmedic);
            if(nbmedic.indexOf(me.username) != -1){
                return false;
            }

            if(nbmedic.length > 1){
                var message = "Tous les slots medic sont déjà pris.";
                socket.emit('pickup-message', message);
                return false;
            }

            var map = {};
            map.mapname = user.mapname;  
            map.mappic = user.mappic;  
              
            var medic = user;
            medic.username = me.username;
            medic.id = me.id;
            medic.skill = me.skillmedic;
            medic.vote = me.vote;
            medic.avatar = me.avatar;
            medic.sktid = me.sktid;
            var oldpickupkey = Object.keys(inpickup);
            clearpick();
            
            nbmedic.push(me.username);
            inpickup[medic.username] = medic;
            var pickupkey = Object.keys(inpickup);
            if(pickupkey.length == 11 && oldpickupkey.indexOf(me.username) == -1){
                io.sockets.emit('displayaudioalert');
            }
            if(pickupkey.length == 12){
                socket.emit('pickupfull');
                io.sockets.emit('pickupfullalert', inpickup);
            }
            votemap(map); 
            io.sockets.emit('nbpickup', pickupkey.length);
            socket.emit('in-pickup');
            io.sockets.emit('newpck', medic);
            io.sockets.emit('nbscout', nbscout);
            io.sockets.emit('nbsoldier', nbsoldier);
            io.sockets.emit('nbdemo', nbdemo);
            io.sockets.emit('nbmedic', nbmedic);
        }else{
            socket.emit('refresh');
        }
     
    });

    //votemap
    socket.on('votemap', function(map){
        votemap(map);
    });

    //set-ready
    socket.on('setready', function(){
        if(me){
            for(var k in readytopickup){
                if(readytopickup[k] == me.username){
                    readytopickup.splice(k, 1);
                }
            }
            readytopickup.push(me.username);
            io.sockets.emit('isready', me);
        }
        
    });

    socket.on('testing', function(){
        var testmes = "coucou";
        for(k in inpickup){
            if(inpickup[k].sktid != ""){
                io.sockets.connected[inpickup[k].sktid].emit('testcallback', testmes);
            } 
         }
    });

    socket.on('unsetready', function(){
        clearReady();
        // console.log(readytopickup);
        io.sockets.emit('isntready', me);
    });

    // count down lorsque le pickup est full
    socket.on('countdownready', function (data) {
        var countdown = 31;
        var intervalID = setInterval(function() {
                countdown--;
                var pickupkeyint = Object.keys(inpickup);
                if(pickupkeyint.length < 12){
                    clearInterval(intervalID);
                    console.log('le pickup stop');
                    io.sockets.emit('pickupnotfull');

                }
                if(readytopickup.length > 11){
                    clearInterval(intervalID);
                    console.log('le pickup va commencer');
                    var players = {};
                    players = inpickup;
                    var redteam = {};
                    var bluteam = {};
                    var chosenmap = "";
                    var ServerFinal = {};
            // recup map
                    
                    var tempmaps = [];
                    var tabmapres = [];

                    if(maps.length > 0){
                        for(k in maps){
                            tempmaps.push(maps[k].mapname);
                        }

                        tempmaps.sort();
                        var lastmap = "";
                        for(k in tempmaps){
                            if(lastmap != tempmaps[k]){
                                var num = 1;
                                tabmapres.push({ k : tempmaps[k], v : num});
                                lastmap = tempmaps[k];
                            }else{
                                num++;
                                tabmapres.splice(k-1,1);
                                tabmapres.push({ k : tempmaps[k], v : num});
                            }
                         }

                        tabmapres.sort(function(a,b){
                           if(a.v < b.v){ return 1}
                            if(a.v > b.v){ return -1}
                              return 0;
                        });
                        var nbvotemap = false;
                        var finalmap = [];
                        for(k in tabmapres){
                            if(tabmapres[k].v == nbvotemap || !nbvotemap){
                                finalmap.push(tabmapres[k].k);
                                nbvotemap = tabmapres[k].v;
                            }
                        }

                        if(finalmap.length > 1){
                            chosenmap = finalmap[Math.floor((Math.random() * finalmap.length))];
                        }else{
                            chosenmap = finalmap[0];
                        }
                    }else{
                        chosenmap = "cp_badlands";
                    }

            // medic traitement
                    var medic = {};
                    var cptm = 1;
                    for(k in inpickup){
                        if(inpickup[k].type == "medic"){
                            medic["medic"+cptm] = inpickup[k];
                            cptm++;
                        }
                    }

            // demo traitement
                    var demo = {};
                    for(k in inpickup){
                        if(inpickup[k].type == "demo"){
                            demo[inpickup[k].username] = inpickup[k];
                        }
                    }
                    var tempdem = [];
                    for(k in demo){
                        tempdem.push({k : demo[k].username, v : demo[k].skill});
                    }
                    tempdem.sort(function(a,b){
                        if(a.v > b.v){ return 1}
                        if(a.v < b.v){ return -1}
                        return 0;
                    });
                    var demoorder = {}
                    var cptdem = 1;
                    for(k in tempdem){
                        demoorder["demo"+cptdem] = demo[tempdem[k].k];
                        cptdem++;
                    }

            // scout traitement
                    var scout = {};
                    for(k in inpickup){
                        if(inpickup[k].type == "scout"){
                            scout[inpickup[k].username] = inpickup[k];
                        }
                    }
                    var tempsc = [];
                    for(k in scout){
                        tempsc.push({k : scout[k].username, v : scout[k].skill});
                    }
                    tempsc.sort(function(a,b){
                        if(a.v > b.v){ return 1}
                        if(a.v < b.v){ return -1}
                        return 0;
                    });
                    var scoutorder = {}
                    var cptsc = 1;
                    for(k in tempsc){
                        scoutorder["scout"+cptsc] = scout[tempsc[k].k];
                        cptsc++;
                    }

            // soldier traitement
                    var soldier = {};
                    for(k in inpickup){
                        if(inpickup[k].type == "soldier"){
                            soldier[inpickup[k].username] = inpickup[k];
                        }
                    }
                    var tempsol = [];
                    for(k in soldier){
                        tempsol.push({k : soldier[k].username, v : soldier[k].skill});
                    }
                    tempsol.sort(function(a,b){
                        if(a.v > b.v){ return 1}
                        if(a.v < b.v){ return -1}
                        return 0;
                    });
                    // console.log('tempsol');
                    var soldierorder = {}
                    var cptsol = 1;
                    for(k in tempsol){
                        soldierorder["soldier"+cptsol] = soldier[tempsol[k].k];
                        cptsol++;
                    }
                  
            // repartition des teams
                // medic
                    if(Math.floor((Math.random() * 2) + 1) == 1){
                        bluteam["medic"] = medic["medic1"];
                        redteam["medic"] = medic["medic2"];
                    }else{
                        bluteam["medic"] = medic["medic2"];
                        redteam["medic"] = medic["medic1"];
                    }
                // demo
                    var bluteamscore = bluteam["medic"].skill;
                    var redteamscore = redteam["medic"].skill;
                    if(bluteamscore == redteamscore){
                        if(Math.floor((Math.random() * 2) + 1) == 1){
                            bluteam["demo"] = demoorder["demo1"];
                            redteam["demo"] = demoorder["demo2"];
                        }else{
                            bluteam["demo"] = demoorder["demo2"];
                            redteam["demo"] = demoorder["demo1"];
                        }
                    }

                    if(bluteamscore < redteamscore){
                        bluteam["demo"] = demoorder["demo2"];
                        redteam["demo"] = demoorder["demo1"];
                    }else{
                        bluteam["demo"] = demoorder["demo1"];
                        redteam["demo"] = demoorder["demo2"];
                    }
                // premier scout
                    bluteamscore = bluteamscore + bluteam["demo"].skill;
                    redteamscore = redteamscore + redteam["demo"].skill;
                    if(bluteamscore == redteamscore){
                        if(Math.floor((Math.random() * 2) + 1) == 1){
                            bluteam["scout1"] = scoutorder["scout1"];
                            redteam["scout1"] = scoutorder["scout2"];
                        }else{
                            bluteam["scout1"] = scoutorder["scout2"];
                            redteam["scout1"] = scoutorder["scout1"];
                        }
                    }

                    if(bluteamscore < redteamscore){
                        bluteam["scout1"] = scoutorder["scout2"];
                        redteam["scout1"] = scoutorder["scout1"];
                    }else{
                        bluteam["scout1"] = scoutorder["scout1"];
                        redteam["scout1"] = scoutorder["scout2"];
                    }
                // premier soldier
                    bluteamscore = bluteamscore + bluteam["scout1"].skill;
                    redteamscore = redteamscore + redteam["scout1"].skill;
                    if(bluteamscore == redteamscore){
                        if(Math.floor((Math.random() * 2) + 1) == 1){
                            bluteam["soldier1"] = soldierorder["soldier1"];
                            redteam["soldier1"] = soldierorder["soldier2"];
                        }else{
                            bluteam["soldier1"] = soldierorder["soldier2"];
                            redteam["soldier1"] = soldierorder["soldier1"];
                        }
                    }

                    if(bluteamscore < redteamscore){
                        bluteam["soldier1"] = soldierorder["soldier2"];
                        redteam["soldier1"] = soldierorder["soldier1"];
                    }else{
                        bluteam["soldier1"] = soldierorder["soldier1"];
                        redteam["soldier1"] = soldierorder["soldier2"];
                    }

                // deuxieme scout
                    bluteamscore = bluteamscore + bluteam["soldier1"].skill;
                    redteamscore = redteamscore + redteam["soldier1"].skill;
                    if(bluteamscore == redteamscore){
                        if(Math.floor((Math.random() * 2) + 1) == 1){
                            bluteam["scout2"] = scoutorder["scout3"];
                            redteam["scout2"] = scoutorder["scout4"];
                        }else{
                            bluteam["scout2"] = scoutorder["scout4"];
                            redteam["scout2"] = scoutorder["scout3"];
                        }
                    }

                    if(bluteamscore < redteamscore){
                        bluteam["scout2"] = scoutorder["scout4"];
                        redteam["scout2"] = scoutorder["scout3"];
                    }else{
                        bluteam["scout2"] = scoutorder["scout3"];
                        redteam["scout2"] = scoutorder["scout4"];
                    }

                // deuxieme soldier
                    bluteamscore = bluteamscore + bluteam["scout2"].skill;
                    redteamscore = redteamscore + redteam["scout2"].skill;
                    if(bluteamscore == redteamscore){
                        if(Math.floor((Math.random() * 2) + 1) == 1){
                            bluteam["soldier2"] = soldierorder["soldier3"];
                            redteam["soldier2"] = soldierorder["soldier4"];
                        }else{
                            bluteam["soldier2"] = soldierorder["soldier4"];
                            redteam["soldier2"] = soldierorder["soldier3"];
                        }
                    }

                    if(bluteamscore < redteamscore){
                        bluteam["soldier2"] = soldierorder["soldier4"];
                        redteam["soldier2"] = soldierorder["soldier3"];
                    }else{
                        bluteam["soldier2"] = soldierorder["soldier3"];
                        redteam["soldier2"] = soldierorder["soldier4"];
                    }
                    var connectLink = "";
                    var queryStringServer = 'SELECT * FROM pickup_server where is_active = 1';
                    connection.query(queryStringServer, function(err, rows, fields) {
                        var ServerFound = false;
                        if (err) throw err;
                        cptServ = 0;
                        console.log(rows.length);
                        while(!ServerFound){
                            io.sockets.emit('searchServ');
                            
                            var servIp = rows[cptServ].server_ip;
                            var servPort = rows[cptServ].server_port;
                            var servRcon = rows[cptServ].server_rcon;
                            var servPass = rows[cptServ].server_password;
                            var cmd = "changelevel " + chosenmap;
                            ssq.info(servIp , servPort, function (err, data) {
                                console.log("numplayers : "+data.numplayers);
                                if(data.numplayers < 2){
                                       
                                    var rcon = new Rcon({
                                        address: servIp+':'+servPort,
                                        password: servRcon,
                                        initCvars: false
                                    });

                                    rcon.connect(function() {
                                        rcon.runCommand(cmd, function(err, res) {
                                            !err && console.log('Changed map to '+chosenmap);
                                        });
                                        rcon.runCommand(cmd, function(err, res) {
                                            !err && console.log('Changed map to '+chosenmap);
                                        });
                                    });
                                   
                                    connectLink = "steam://connect/"+servIp+":"+servPort+"/"+servPass;
                                    console.log(connectLink);
                                    ServerFound = true;

                                    io.sockets.emit('pickupnotfull');
                                  
                                    var notready = Object.keys(inpickup);
                                    for(var k in notready){
                                        var user = inpickup[notready[k]];
                                        io.sockets.emit('user-quit', user);
                                        // removefrompick(notready[k]);
                                    }
                                    for(k in inpickup){
                                        if(inpickup[k].sktid != ""){
                                            io.sockets.connected[inpickup[k].sktid].emit('hide-in-pickup');
                                            io.sockets.connected[inpickup[k].sktid].emit('pickupstart', bluteam, redteam, chosenmap, connectLink);
                                            io.sockets.connected[inpickup[k].sktid].emit('launchGame', connectLink);
                                        }
                                    }
                                    
                                     for(var k in notready){
                                        var user = inpickup[notready[k]];
                                        // io.sockets.emit('user-quit', user);
                                        removefrompick(notready[k]);
                                    }


                                    io.sockets.emit('votemapres', maps);
                                    var pickupkey = Object.keys(inpickup);
                                    io.sockets.emit('nbpickup', pickupkey.length);
                                    io.sockets.emit('nbscout', nbscout);
                                    io.sockets.emit('nbsoldier', nbsoldier);
                                    io.sockets.emit('nbdemo', nbdemo);
                                    io.sockets.emit('nbmedic', nbmedic);
                                    io.sockets.emit('timerend');


                                                
                                    
                                    
                                    
                                    
                                }
                            }); 
                            console.log("cpt : "+cptServ);
                            console.log(ServerFound);
                            cptServ = cptServ + 1;
                            
                            if(cptServ == rows.length){cptServ = 0; ServerFound = true;}

                        }


                        

                    });
    
                    
                    

                }

                if(countdown < 1){
                    clearInterval(intervalID);
                    var notready = Object.keys(inpickup);
                    console.log(notready);
                    for(var k in readytopickup){
                        var index = notready.indexOf(readytopickup[k]);
                        if (index >= 0) {
                          notready.splice( index, 1 );
                        }   
                    }
                    for(var k in notready){
                        var user = inpickup[notready[k]];
                        io.sockets.emit('user-quit', user);
                        removefrompick(notready[k]);
                    }

                    io.sockets.emit('pickupnotfull');
                    io.sockets.emit('votemapres', maps);
                    socket.emit('hide-in-pickup');
                    var pickupkey = Object.keys(inpickup);
                    io.sockets.emit('nbpickup', pickupkey.length);
                    io.sockets.emit('nbscout', nbscout);
                    io.sockets.emit('nbsoldier', nbsoldier);
                    io.sockets.emit('nbdemo', nbdemo);
                    io.sockets.emit('nbmedic', nbmedic);
                    io.sockets.emit('timerend');
                }
                io.sockets.emit('timer', { countdown: countdown });            
            }, 1000);
      
     });

    
    // subrequest

    socket.on('subrequest', function(sub){
        console.log(sub.type);
        console.log(sub.mapname);
        console.log(sub.subid);
    });

    // reception de message
    socket.on('newmsg', function(message){
        message.user = me;
        date = new Date();
        message.h = ( '0' + date.getHours()).slice(-2);
        message.m = ( '0' + date.getMinutes()).slice(-2);
        messages.push(message);
        if(messages.length > history){
            messages.shift();
        }
        io.sockets.emit('newmsg', message);
    });


    
    /**
        quit and disconnect part
    */
    socket.on('quit-pickup', function(){
        for(var k in nbscout){
            if(nbscout[k] == me.username){
                nbscout.splice(k, 1);
            }
        }
        for(var k in nbsoldier){
            if(nbsoldier[k] == me.username){
                nbsoldier.splice(k, 1);
            }
        }
        for(var k in nbdemo){
            if(nbdemo[k] == me.username){
                nbdemo.splice(k, 1);
            }
        }
        for(var k in nbmedic){
            if(nbmedic[k] == me.username){
                nbmedic.splice(k, 1);
            }
        }          
        
        for(var k in maps){
            if(maps[k].user == me.username){
                maps.splice(k, 10);
            }
        }
        io.sockets.emit('pickupnotfull');
        removefrompick(me.username);
        clearReady();
        // console.log(readytopickup);
        delete inpickup[me.username];
        io.sockets.emit('votemapres', maps);
        // io.sockets.emit('votemappick', maps);
        socket.emit('hide-in-pickup');
        io.sockets.emit('user-quit', me);
        var pickupkey = Object.keys(inpickup);
        io.sockets.emit('nbpickup', pickupkey.length);
        io.sockets.emit('nbscout', nbscout);
        io.sockets.emit('nbsoldier', nbsoldier);
        io.sockets.emit('nbdemo', nbdemo);
        io.sockets.emit('nbmedic', nbmedic);
    });


    socket.on('disconnect', function(){
        if(!me){
            return false
        }
        for(var k in nbscout){
            if(nbscout[k] == me.username){
                nbscout.splice(k, 1);
            }
        }
        for(var k in nbsoldier){
            if(nbsoldier[k] == me.username){
                nbsoldier.splice(k, 1);
            }
        }
        for(var k in nbdemo){
            if(nbdemo[k] == me.username){
                nbdemo.splice(k, 1);
            }
        }
        for(var k in nbmedic){
            if(nbmedic[k] == me.username){
                nbmedic.splice(k, 1);
            }
        }
        for(var k in maps){
            if(maps[k].user == me.username){
                maps.splice(k, 10);
            }
        }
        io.sockets.emit('pickupnotfull');
        clearReady();
        // console.log(readytopickup);
        // delete maps[me.username];
        delete inpickup[me.username];
        delete users[me.username];
        var userskey = Object.keys(users);
        io.sockets.emit('nbusers', userskey.length);
        io.sockets.emit('votemapres', maps);
        // io.sockets.emit('votemappick', maps);
        var pickupkey = Object.keys(inpickup);
        io.sockets.emit('nbpickup', pickupkey.length);
        io.sockets.emit('nbscout', nbscout);
        io.sockets.emit('nbsoldier', nbsoldier);
        io.sockets.emit('nbdemo', nbdemo);
        io.sockets.emit('nbmedic', nbmedic);
        io.sockets.emit('disusr', me);
        // console.log(inpickup);


    });
});