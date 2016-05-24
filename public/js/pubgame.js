$(document).ready(function () {
    var pongCb = function(gameId) {
      return function(m) {
        var gamescreen = window.pong.games[gameId];
        console.log(new Date(), "game received", m)
        if (m.side === "left") {
          if (m.target === "up") {
            if (m.type === "touchstart") {
              gamescreen.leftPaddle.moveUp();
            }
            else {
              gamescreen.leftPaddle.stopMovingUp();
            }
          }
          else if (m.target === "down") {
            if (m.type === "touchstart") {
              gamescreen.leftPaddle.moveDown();
            }
            else {
              gamescreen.leftPaddle.stopMovingDown();
            }
          }
        }
        else if (m.side === "right") {
          if (m.target === "up") {
            if (m.type === "touchstart") {
              gamescreen.rightPaddle.moveUp();
            }
            else {
              gamescreen.rightPaddle.stopMovingUp();
            }
          }
          else if (m.target === "down") {
            if (m.type === "touchstart") {
              gamescreen.rightPaddle.moveDown();
            }
            else {
              gamescreen.rightPaddle.stopMovingDown();
            }
          }
        }
      };
    };

    var id = window.pong.sessionId,
      channel = 'pong:' + id,
      pusherChannel = 'private-pong;' + id,
      realtimes = getRealtimes();

    console.log("Pubnub: subscribing to " + channel);
    realtimes.pubnub_native.subscribe({
        channel: channel,
        callback: pongCb('pubnub-native')
    });

    console.log("Pubnub translator: subscribing to " + channel);
    realtimes.pubnub_translator.subscribe({
        channel: channel,
        callback: pongCb('pubnub-translator')
    });

    console.log("Ably: subscribing to " + channel);
    var ablyCb = pongCb('ably');
    realtimes.ably.channels.get(channel).subscribe('pong', function(msg) { ablyCb(msg.data) });

    console.log("Pusher: subscribing to " + 'private-' + channel);
    var pusher_channel = realtimes.pusher_native.subscribe(pusherChannel);
    pusher_channel.bind('client-pong', pongCb('pusher-native'));

    console.log("Pusher translator: subscribing to " + 'private-' + channel);
    var pusher_translator_channel = realtimes.pusher_translator.subscribe(pusherChannel);
    pusher_translator_channel.bind('client-pong', pongCb('pusher-translator'));

});
