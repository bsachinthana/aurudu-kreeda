const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors');

app.use(cors());

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

const gamesMap = new Map();
const TOTAL_GAME_POINTS = 1000;
const MAX_PLAYERS = 6;

class Game{
  constructor(){
    this.count = 0;
    this.right = [];
    this.left = [];
    this.score = 0;
    this.teamNames = {
      left : '',
      right : ''
    }
  }


  addPlayer(player, side)
  {
    this[side].push(player);
    this.count ++;
  }

  isFull(){
    return this.count == MAX_PLAYERS;
  }

  removePlayer(socketId){
    this.left = obj.left.filter(x => x.id != socketId);
    this.right = obj.right.filter(x => x.id != socketId);
    this.count = this.left.length + this.right.length;
  }
}
function generateGameId() {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getSide(gameObj, isRandom = false) {
  if (isRandom) {
    if (gameObj.count % 2 === 0) {
      return (Math.random() >= 0.5) ? 'right' : 'left';
    } else {
      return (gameObj.left.length > gameObj.right.length) ? 'right' : 'left';
    }
  } else {
    return gameObj.count < (MAX_PLAYERS / 2) ? 'left' : 'right';
  }

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

      var game = new Game();
      var side = getSide(game, false);
      game.addPlayer(player, side);
      game.teamNames = data.teamNames;
      console.log(game);
      gamesMap.set(gameId, game);

    } else if (data.connection === 'join') {
      gameId = data.gameId;
      var gameObj = gamesMap.get(gameId);

      if (!gameObj) {
        return socket.emit("message", { status: "InvalidGameId" });
      }

      if (gameObj.count === MAX_PLAYERS) {
        return socket.emit("message", { status: "GameFull" });
      }

      var side = getSide(gameObj, false);
      gameObj.addPlayer(player,side);
      gameObj = gamesMap.set(gameId, gameObj);
    }

    // Socket Join
    socket.join(gameId, (err) => {
      var finalGameObj = gamesMap.get(gameId);
      if (err) return console.log(err);
      socket.emit("message",
        {
          status: 'JoinSuccess',
          data: {
            player: { id: gameId, side: side },
            gameStatus: finalGameObj
          }
        });

      io.to(gameId).emit("message",
        {
          status: 'PlayerAdded',
          gameStatus: finalGameObj
        });

      //Emit game start event to all room members
      if (finalGameObj.isFull()) {
        io.to(gameId).emit("message",
          {
            status: 'GameStart',
            data: {
              gameStatus: finalGameObj
            }
          });
        count = 3;
        var countdownTimer = setInterval(function () {
          io.to(gameId).emit("message", {
            status: 'Countdown',
            data: count
          });
          if (count == 0) {
            clearInterval(countdownTimer);
          }
          count--;
        }, 1250);
      }
      console.log(data.name + " Joined game " + gameId);
    });


    // Game logic listeners
    socket.on("GameData", function (data) {
      var obj = gamesMap.get(data.gameId);
      if(!obj){
        return;
      }
      const effectiveRate = data.rate > 5 ? data.rate : 0;
      obj.score = data.side === 'left' ? obj.score - effectiveRate : obj.score + effectiveRate;
      gamesMap.set(data.gameId, obj);

      if (obj.score > TOTAL_GAME_POINTS || obj.score < -TOTAL_GAME_POINTS) {
        io.to(data.gameId).removeAllListeners("GameData");

        io.to(data.gameId).emit("message", { status: "GameEnd", score: obj.score });

        //remove all sockets from the room
        io.in(data.gameId).clients((error, socketIds) => {
          if (error) throw error;
          socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(data.gameId));
        });

        // remove game data from the server
        gamesMap.delete(data.gameId);

        return;
      }

      io.to(data.gameId).emit("message", { status: "GameDataUpdate", score: obj.score / TOTAL_GAME_POINTS });
    });

    //Disconenct Listener
    socket.on("disconnect", () => {
      var obj = gamesMap.get(data.gameId);
      if (obj) {
        obj.removePlayer(socket.id);
        gamesMap.set(data.gameId, obj);
      }

      io.to(data.gameId).emit("message",
        {
          status: 'PlayerDisconnected',
          data: {
            gameStatus: obj
          }
        });
      console.log('Disconnected ' + socket.id + ' from game ' + data.gameId);
    });
  });
});

http.listen((process.env.PORT  || 3000 ), function () {
  console.log('listening on *:3000');
});