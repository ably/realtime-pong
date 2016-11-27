$(document).ready(function(){
    $("#controls").show();

    var id = getURLParameter('id'),
      channelName = 'private:pong-' + id,
      pusherChannelName = 'private-pong-' + id,
      realtimes = getRealtimes(),
      mySide = "left",
      pusherChannel = realtimes.pusher_native.subscribe(pusherChannelName),
      ablyChannel = realtimes.ably.channels.get(channelName);

    document.ontouchstart = function(e){
      e.preventDefault();
    }

    var publishAction = function(action) {
      ablyChannel.publish('client-pong', action);

      pusherChannel.trigger('client-pong', action);

      realtimes.pubnub_native.publish({
        channel: channelName,
        message: action
      });
    }

    var touchHandler = function(eve) {
        var target = eve.target.id;
        var type = eve.type;
        if (type === "mousedown") type = "touchstart";
        if (type === "mouseup") type = "touchend";
        if (type === "mouseleave") type = "touchend";
        if (type === "mousleave") type = "touchend";
        var time = eve.time;


        publishAction({"target": target, "type": type, side: mySide, id: Math.random()});
    }

    document.addEventListener("touchstart", function(e) {touchHandler(e)}, false);
    document.addEventListener("touchend", function(e) {touchHandler(e);}, false);
    document.addEventListener("touchleave", function(e) {touchHandler(e);}, false);
    document.addEventListener("touchcancel", function(e) {touchHandler(e);}, false);
    document.addEventListener("mousedown", function(e) {touchHandler(e);}, false);
    document.addEventListener("mouseup", function(e) {touchHandler(e);}, false);
    document.addEventListener("mouseleave", function(e) {touchHandler(e);}, false);

    $(document).keydown(function(e) {
      if (e.which == "40") touchHandler({target: {id : "down"}, type: "mousedown" });
      if (e.which == "38") touchHandler({target: {id: "up"}, type: "mousedown" });
    });

    $(document).keyup(function(e) {
      if (e.which == "40") touchHandler({target: {id : "down"}, type: "mouseup" });
      if (e.which == "38") touchHandler({target: {id : "up"}, type: "mousup" });
    });
});
