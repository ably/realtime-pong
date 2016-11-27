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
      channelName = 'private:pong-' + id,
      pusherChannelName = 'private-pong-' + id,
      realtimes = getRealtimes();

    console.log("Pubnub: subscribing to " + channelName);
    realtimes.pubnub_native.subscribe({
      channel: channelName,
      callback: pongCb('pubnub-native')
    });

    console.log("Pubnub translator: subscribing to " + channelName);
    realtimes.pubnub_translator.subscribe({
      channel: channelName,
      callback: pongCb('pubnub-translator')
    });

    console.log("Ably: subscribing to " + channelName);
    var ablyCb = pongCb('ably');
    realtimes.ably.channels.get(channelName).subscribe('client-pong', function(msg) { ablyCb(msg.data) });

    console.log("Pusher: subscribing to " + pusherChannelName);
    var pusherChannel = realtimes.pusher_native.subscribe(pusherChannelName);
    pusherChannel.bind('client-pong', pongCb('pusher-native'));

    console.log("Pusher translator: subscribing to " + pusherChannelName);
    var pusherTranslatorChannel = realtimes.pusher_translator.subscribe(pusherChannelName);
    pusherTranslatorChannel.bind('client-pong', pongCb('pusher-translator'));

});
