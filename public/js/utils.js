function getURLParameter(name) { // Grabs URL Parameters
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function getRealtimes() {
  /***** PUBNUB *****/

  var pubnub_native = PUBNUB.init({
    publish_key: 'pub-c-0ecaf3c4-bc3a-4e03-94e7-e85e196fdc4c',
    subscribe_key: 'sub-c-673a62aa-24c9-11e4-a77a-02ee2ddab7fe',
    ssl: true,
    no_wait_for_pending: true,
  });

  /***** PUBNUB ABLY TRANSLATOR *****/

  var pubnub_translator = PUBNUB.init({
    publish_key: 'FSW9jQ.8fLwUA:pgpgtFyQ7Da3jOjt',
    subscribe_key: 'FSW9jQ.8fLwUA:pgpgtFyQ7Da3jOjt',
    origin: 'pubnub.ably.io',
    ssl: true,
    no_wait_for_pending: true,
  });

  /***** ABLY *****/

  var ably = new Ably.Realtime('FSW9jQ.8fLwUA:pgpgtFyQ7Da3jOjt');

  /***** PUSHER *****/

  var pusher_native = new Pusher('ba51c4c260266ff52b26', {
    authEndpoint: '/auth/pusher',
  });

  /***** PUSHER ABLY TRANSLATOR *****/

  var pusher_translator = new Pusher('FSW9jQ.8fLwUA', {
    authEndpoint: '/auth/pusher-translator',
    wsHost:       'realtime-pusher.ably.io',
    httpHost:     'realtime-pusher.ably.io',
  });

  return {
    pubnub_native: pubnub_native,
    pubnub_translator: pubnub_translator,
    ably: ably,
    pusher_native: pusher_native,
    pusher_translator: pusher_translator,
  };
}

function randomString() {
  return Math.random().toString().slice(2, 8);
}

function createOrRetrieveSessionId() {
  var key = 'pongSessionId', sessionId;
  /* Even just checking if the localStorage exists can throw a security
   * exception in some circumstances with some browsers. So just charge ahead
   * and try, and rescue any exception. */
  try {
    if(sessionId = window.localStorage.getItem(key)) {
      return sessionId;
    } else {
      sessionId = randomString();
      window.localStorage.setItem(key, sessionId);
      return sessionId;
    }
  } catch(e) {
    return randomString();
  }
}
