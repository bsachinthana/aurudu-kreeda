const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

const gamesMap = new Map();

function generateGameId() {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

io.on('connection', (socket) => {
  console.log("connected");

  socket.on("joinGame", (data) => {
    var gameId;
    var side;
    const player = {
      id: socket.id,
      name: data.name,
    };

    //Check for Host or Join
    if (data.connection === 'host') {
      gameId = generateGameId();
      while (gamesMap.has(gameId)) {
        gameId = generateGameId();
      }

      const game = {
        count: 1,
        right: [],
        left: [],
        score:0
      };

      var boolSide = Math.random() >= 0.5;
      side = boolSide ? 'right' : 'left';
      if (boolSide) {
        game.right.push(player);
      } else {
        game.left.push(player);
      }
      gamesMap.set(gameId, game);
    } else if (data.connection === 'join') {
      gameId = data.gameId;
      var gameObj = gamesMap.get(gameId);

      if(!gameObj)
      {
        return socket.emit("message", { status:"InvalidGameId" });
      }

      if(gameObj.count === 6)
      {
        return socket.emit("message", { status:"GameFull" });
      }

      if (gameObj.count %2 === 0) {
        var boolSide = (Math.random() >= 0.5);
        side = boolSide ? 'right' : 'left';
        if (boolSide) {
          gameObj.right.push(player);
        } else {
          gameObj.left.push(player);
        }
      }else{
        if(gameObj.left.length>gameObj.right.length)
        {
          gameObj.right.push(player);
          side = 'right';
        }else{
          gameObj.left.push(player);
          side = 'left';
        }
      }
        gameObj.count++;
        gameObj = gamesMap.set(gameId, gameObj); 
    }

    // Socket Join
    socket.join(gameId, (err) => {
      var finalGameObj = gamesMap.get(gameId);
      if (err) return console.log(err);
      socket.emit("message", 
      { status: 'JoinSuccess',
        data: { 
          player:{id: gameId, side: side },
          gameStatus:finalGameObj
        } 
      });

      io.to(gameId).emit("message", 
      { status: 'PlayerAdded',
        gameStatus:finalGameObj
      });

      //Emit game start event to all room members
      if (finalGameObj.count === 6) {
        io.to(gameId).emit("message",
          {
            status: 'GameStart',
            data: {
              gameStatus: finalGameObj
            }
          });
          count = 3;
          var countdownTimer = setInterval(function(){
            io.to(gameId).emit("message",{
              status:'Countdown',
              data:count
            });
            count--
            if(count==0)
            {
              clearInterval(countdownTimer);
            }
          }, 1500);
      }
      console.log(data.name + " Joined game " + gameId);
    });


    // Game logic listeners
    socket.on("GameData", function(data){
      var obj = gamesMap.get(data.gameId);
      obj.score = data.side === 'left'?obj.score-data.rate:obj.score+data.rate;
      gamesMap.set(data.gameId, obj);
      if(obj.score >300 || obj.score < -300)
      {
        io.to(data.gameId).removeAllListeners("GameData");
        return io.to(data.gameId).emit("message",{status:"GameEnd",score:obj.score});
      }
      io.to(data.gameId).emit("message",{status:"GameDataUpdate",score:obj.score});
    });
    
    //Disconenct Listener
    socket.on("disconnect", () => {
      var obj = gamesMap.get(data.gameId);
      if(obj) {
        obj.left = obj.left.filter(x => x.id != socket.id);
        obj.right = obj.right.filter(x => x.id != socket.id);
        obj.count--;
        gamesMap.set(data.gameId,obj);
      }

      io.to(data.gameId).emit("message", 
      { status: 'PlayerDisconnected',
        data: { 
          gameStatus:obj
        } 
      });
      console.log('Disconnected ' + socket.id + ' from game ' + data.gameId);
    });
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});