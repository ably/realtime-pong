require 'sinatra'
require 'json'
require 'pusher'
require 'ably-rest'

set :static, true

pusher = Pusher::Client.new(
  app_id: 119780,
  key:    'ba51c4c260266ff52b26',
  secret: ENV['PUSHER_SECRET'],
)

pusher_translator = Pusher::Client.new(
  app_id: 'FSW9jQ',
  key:    'FSW9jQ.8fLwUA',
  # Need to expose the Ably secret in plain text for Pubnub, so not much point hiding it here
  secret: 'pgpgtFyQ7Da3jOjt',
  host:   'pusher-rest.ably.io'
)

multiplayer_snake_rest = Ably::Rest.new(key: "TgylBg.umYgYA:yPTJV-tIb8j3fY7D")

post '/auth/pusher' do
  content_type :json
  if (channel_name = params[:channel_name]).start_with? "private-pong"
    pusher.authenticate(channel_name, params[:socket_id]).to_json
  else
    status 401
  end
end

post '/auth/pusher-translator' do
  content_type :json
  if (channel_name = params[:channel_name]).start_with? "private-pong"
    pusher_translator.authenticate(channel_name, params[:socket_id]).to_json
  else
    status 401
  end
end

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

get '/auth/multiplayer-snake' do
  content_type :json
  multiplayer_snake_rest.auth.create_token_request({
    capability: {"snake:*" => ['publish', 'subscribe']}
  }).to_json
end
