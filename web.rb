require 'sinatra'
require 'haml'
require 'curl'
require 'json'

get '/' do
  haml :index, :layout => :layout
end

get '/stats' do
  haml :stats, :layout => :layout
end

get '/game-stats' do

  haml :game_stats, :layout => :layout
end

get '/log-action' do
  if(params[:log])
      location = params[:location]
      
      params.delete('game_id')
      params.delete('action')
      params.delete('controller')
      params.delete('action_number');
      params.delete('location')
      url = "https://lusl-dev.firebaseio.com/game_logs/#{location}/logs.json"
      puts url
      c = Curl::Easy.new(url)
      c.http_post(params.to_json)
      
      params.inspect      
    else    
      location = params[:location]
      
      params.delete('game_id')
      params.delete('action')
      params.delete('controller')
      params.delete('action_number');
      params.delete('location')
      puts "test 123"
      url = "https://lusl-dev.firebaseio.com/game_logs/#{location}.json"

      c = Curl.patch(url, params.to_json);
      params[:url] = url      
      params.inspect
    end
end
  