require 'sinatra'

get '/' do
  haml :index, :layout => :layout
end

get '/stats' do
  haml :stats, :layout => :layout
end

get '/game-stats' do
  haml :game_stats, :layout => :layout
end