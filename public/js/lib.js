var firebase_auth = function() {
  
  var set_auth_token = function(user, callback) {
    callback = callback || function() {}
    $.ajaxSetup({
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
      }
    }); 
    $.post('/set_auth_token', { 
        auth: user
      }, function(response) {
        callback(user);
    });
  };
  
  var defaults = {
    onSuccessfulLogin: function() {
      $('.logged-in').show();
    },
    onBadLogin: function() {},
    onSuccessfulUserCreation: function(user) {},
    onBadUserCreation: function(error) {}
  };
  
  settings = defaults;
  
  var loginRef;
  window.loginRef = loginRef;
  
  var authClient;
  
  var facebook_login = function(params) {
    settings = $.extend(settings, params);
    
    authClient.login('facebook');
  };
  
  var login = function(params) {
    var params = params || {}
    settings = $.extend(settings, params);
    
    loginRef = new Firebase(firebase_url);

    authClient = new FirebaseAuthClient(loginRef, function(error, user) {
      if (user) { 
        set_auth_token(user, settings.onSuccessfulLogin);
      } else {
        settings.onBadLogin(error);
      }
    });
  };
  
  var authenticate_password = function(email, password, params) {
    var params = params || {}
    settings = $.extend(settings, params);
    
    var credentials = { email: email, password: password };
    authClient.login('password', credentials);
  };
  
  var logout = function() {
    settings.onSuccessfulLogin = logout;
    authClient.logout();
    window.location = '/lusl_login'
  };
  
  var create_user = function(username, password, registration_id, params) {
    var params = params || {}
    settings = $.extend(settings, params);
    authClient.createUser(username, password, function(error, user) {
      if (user) {        
        lusl_db.update_player({
          id: registration_id,
          auth_user_id: user.id
        });        
        authenticate_password(username, password);
      } else {
        settings.onBadUserCreation(error);
      }
    });
  };
  
  login();
  
  return {
    authenticate_password: authenticate_password,
    create_user: create_user,
    logout: logout,
    login: login,
    facebook_login: facebook_login
  };
}();

var lusl_db = function() {
  var update_player = function(details) {
    if(!details.id) {
      throw "missing .id";
    }
    
    var firebase_registration = new Firebase(firebase_url + 'summer_league_2013/registrations/');
    
    var callback = function(error) {
      if(error && details.onError)
        details.onError(error);
      if(!error && details.onSuccess)
        details.onSuccess();
    };
    
    if(details.week_1_attendance) {
      firebase_registration.child(details.id).update({ week_1_attendance: details.week_1_attendance }, callback);
    }
    
    if(details.week_2_attendance) {
      firebase_registration.child(details.id).update({ week_2_attendance: details.week_2_attendance }, callback);
    }
    
    if(details.week_3_attendance) {
      firebase_registration.child(details.id).update({ week_3_attendance: details.week_3_attendance }, callback);
    }
    
    if(details.week_4_attendance) {
      firebase_registration.child(details.id).update({ week_4_attendance: details.week_4_attendance }, callback);
    }
    
    if(details.week_5_attendance) {
      firebase_registration.child(details.id).update({ week_5_attendance: details.week_5_attendance }, callback);
    }
    
    if(details.week_6_attendance) {
      firebase_registration.child(details.id).update({ week_6_attendance: details.week_6_attendance }, callback);
    }
    
    if(details.week_7_attendance) {
      firebase_registration.child(details.id).update({ week_7_attendance: details.week_7_attendance }, callback);
    }
    
    if(details.week_8_attendance) {
      firebase_registration.child(details.id).update({ week_8_attendance: details.week_8_attendance }, callback);
    }
    
    if(details.week_9_attendance) {
      firebase_registration.child(details.id).update({ week_9_attendance: details.week_9_attendance }, callback);
    }
    
    if(details.week_10_attendance) {
      firebase_registration.child(details.id).update({ week_10_attendance: details.week_10_attendance }, callback);
    }
    
    if(details.week_11_attendance) {
      firebase_registration.child(details.id).update({ week_11_attendance: details.week_11_attendance }, callback);
    }
    
    if(details.tourney_attendance) {
      firebase_registration.child(details.id).update({ tourney_attendance: details.tourney_attendance }, callback);
    }
    
    if(details.shirt_size) {
      firebase_registration.child(details.id).update({ shirt_size: details.shirt_size }, callback);
    }
    if(details.payment_token) {
      firebase_registration.child(details.id).update({ payment_token: details.payment_token }, callback);
    }
    if(details.auth_user_id) {
      firebase_registration.child(details.id).update({ auth_user_id: details.auth_user_id }, callback);
    }
    if(details.email) {
      firebase_registration.child(details.id).update({ email: details.email }, callback);
    }
    if(details.experience) {
      firebase_registration.child(details.id).update({ experience: details.experience }, callback);
    }
    if(details.height) {
      firebase_registration.child(details.id).update({ height: details.height }, callback);
    }
    if(details.skills) {
      firebase_registration.child(details.id).update({ skills: details.skills }, callback);
    }
    if(details.photo) {
      firebase_registration.child(details.id).update({ photo: details.photo }, callback);
    }
    if(details.team) {
      firebase_registration.child(details.id).update({ team: details.team }, callback);
    }
    if(details.name) {
      firebase_registration.child(details.id).update({ name: details.name }, callback);
    }
    if(details.partner) {
      firebase_registration.child(details.id).update({ partner: details.partner }, callback);
    }
  };
                  
  var get_standings_for = function(team_name, callback) {
    var firebase_standings = new Firebase(firebase_url + 'summer_league_2013/standings/'+team_name);
    firebase_standings.on('value', function(snapshot) {
      if(snapshot.val())
        callback(snapshot.val());
    });      
  }
  var update_all_standings = function() {
    var clear_firebase_standings = function() {
      var firebase_standings = new Firebase(firebase_url + 'summer_league_2013/standings/');
      firebase_standings.remove();
    };
    
    clear_firebase_standings();
    
    var team_names = ['Yellow', 'Orange', 'Purple', 'Pink', 'Green', 'Red', 'Black', 'Blue'];
    for(var i = 0; i < team_names.length; i++) {
      lusl_db.update_the_standings_for(team_names[i]);
    };
  };
  var update_the_standings_for = function(team_name) {
    var team = {
      team_name: team_name,
      wins: 0,
      losses: 0,
      pf: 0,
      pa: 0
    };
    
    var firebase_standings = new Firebase(firebase_url+ 'summer_league_2013/standings/'+team_name);
    for (var week = 1; week <= 15; week++) {
      for(var field = 1; field <= 4; field++) {
        lusl_db.get_the_game_details({
          field: field,
          week: week,
          callback: function(details) {
            details.home_score = parseInt(details.home_score || 0, 10);
            details.away_score = parseInt(details.away_score || 0, 10);
            if(details.home_team == team.team_name) {
              if(details.home_score > details.away_score) {
                team.wins++;
                team.pf += details.home_score;
                team.pa += details.away_score;
              } else if(details.home_score < details.away_score) {
                team.losses++;
                team.pf += details.home_score;
                team.pa += details.away_score;
              }
            } else if(details.away_team == team.team_name) {              
              if(details.away_score > details.home_score) {
                team.wins++;
                team.pf += details.away_score;
                team.pa += details.home_score;
              } else if(details.away_score < details.home_score) {
                team.losses++;
                team.pf += details.away_score;
                team.pa += details.home_score;
              }
            }
            
            firebase_standings.set(team);                
          }
        });
      }
    }     
  }
  var get_the_game_details = function(details) {
    var week = details.week;
    var field = details.field;
    var callback = details.callback;
    
    var game = new Firebase(firebase_url + 'summer_league_2013/scores/week_' + week + '/field_' + field);
    game.on('value', function(snapshot) {
      if(!snapshot.val()) { 
        return;
      }
      var home_score = snapshot.val().home_score || 0;
      var away_score = snapshot.val().away_score || 0;
      var home_team = snapshot.val().home_team;
      var away_team = snapshot.val().away_team;
      
      game.off('value');
      
      callback({
        home_score: home_score,
        away_score: away_score,
        home_team: home_team,
        away_team: away_team
      });
      
      return;                   
    });
  };
  var update_the_game_result = function(details) {
    var onComplete = function() {
      lusl_db.update_all_standings();
    };
    
    var week = details.week;
    var field = details.field;
    if(details.home_score) {
      var firebase_home_score = new Firebase(firebase_url + 'summer_league_2013/scores/week_' + week + '/field_' + field);
      firebase_home_score.update({ home_score: details.home_score}, onComplete);
    }
    
    if(details.home_team) {      
      var firebase = new Firebase(firebase_url + 'summer_league_2013/scores/week_' + week + '/field_' + field);
      firebase.update({ home_team: details.home_team }, onComplete);
    }
    
    if(details.away_score) {
      var firebase = new Firebase(firebase_url + 'summer_league_2013/scores/week_' + week + '/field_' + field);
      firebase.update({ away_score: details.away_score}, onComplete);
    }
    
    if(details.away_team) {      
      var firebase = new Firebase(firebase_url + 'summer_league_2013/scores/week_' + week + '/field_' + field);
      firebase.update({ away_team: details.away_team }, onComplete);
    }
  };
  
  return {
    update_player: update_player,
    get_standings_for: get_standings_for,
    update_all_standings: update_all_standings,
    update_the_standings_for: update_the_standings_for,
    get_the_game_details: get_the_game_details,
    update_the_game_result: update_the_game_result
  };
}();

$.fn.extend({ // extending functions for one 'tr' element
  set_game_details: function(details) {
    var score_cell = $(this).get_score_cell();
    var home_score = details.home_score;
    var away_score = details.away_score;
    var home_team_cell = $(this).get_home_team_cell();
    var away_team_cell = $(this).get_away_team_cell();
    var home_team = details.home_team;
    var away_team = details.away_team;
    
    score_cell.html('<span></span>-<span></span>');
    score_cell.find('span').eq(0).text(home_score);
    score_cell.find('span').eq(1).text(away_score);
    home_team_cell.text(home_team);
    away_team_cell.text(away_team);       
  },
  create_score_inputs: function() {
    var score_cell = $(this).find('td').eq(4);
    
    var home_score = $(this).get_home_score();
    var away_score = $(this).get_away_score();
    
    score_cell.html('<input class="home score" /> - <input class="away score" />');
    score_cell.find('input').eq(0).val(home_score);
    score_cell.find('input').eq(1).val(away_score);
  },  
  create_team_name_inputs: function() {
    var home_team_cell = $(this).get_home_team_cell()
    var away_team_cell = $(this).get_away_team_cell();
    
    var home_team = $(this).get_home_team();
    var away_team = $(this).get_away_team();
    
    home_team_cell.html('<input class="home team" />');
    home_team_cell.find('input').val(home_team);
    away_team_cell.html('<input class="away team" />');
    away_team_cell.find('input').val(away_team);
  },
  bind_scores_to_firebase: function() {
    var row = $(this);
    week_cell = $(this).find('td').eq(0);
    score_cell = $(this).find('td').eq(4);
    home_cell = $(this).find('td').eq(2);
    away_cell = $(this).find('td').eq(3);
    field_cell = $(this).find('td').eq(1);
    
    var field_parts = field_cell.text().split(' ');
    var field_number = parseInt(field_parts[1], 10);
    
    var week_parts = week_cell.text().split(' ');
    var week_number = parseInt(week_parts[1], 10);
    
    $(score_cell).find('input').eq(0).bind('change', function() {
      lusl_db.update_the_game_result({
        week_number: week_number,
        home_team: $(row).get_home_team(),
        home_score: $(this).val(),
        field_number: field_number        
      });
    });
    
    $(score_cell).find('input').eq(1).bind('change', function() {
      var away_score = $(this).val();
      var away_team = $(row).get_away_team();
      var firebase_away_score = new Firebase(firebase_url + 'summer_league_2013/scores/week_' + week_number + '/field_' + field_number);
      firebase_away_score.update({ away_score: away_score, away_team: away_team });
    });
  },
  get_week_number: function() {
    var week_cell = $(this).find('td').eq(0);
    var week_parts = week_cell.text().split(' ');
    var week_number = parseInt(week_parts[1], 10);
    return week_number;
  },
  get_field_number: function() {
    var field_cell = $(this).find('td').eq(1)
    var field_parts = field_cell.text().split(' ');
    var field_number = parseInt(field_parts[1], 10);
    return field_number;
  },
  get_home_score: function() {
    var score_cell = $(this).find('td').eq(4)
    var scores = $(score_cell).text().split('-');
    var home_score = parseInt(scores[0], 10);
    return home_score;
  },
  get_away_score: function() {
    var score_cell = $(this).find('td').eq(4)
    var scores = $(score_cell).text().split('-');
    var home_score = parseInt(scores[1], 10);
    return home_score;
  },
  get_score_cell: function() {
    var score_cell = $(this).find('td').eq(4)
    return score_cell;
  },
  show_scores: function() {
      var score_cell = $(this).get_score_cell();
      var home_team_cell = $(this).get_home_team_cell();
      var away_team_cell = $(this).get_away_team_cell();
      
      var week_number = $(this).get_week_number();
      var field_number = $(this).get_field_number();
      
      var game = new Firebase(firebase_url + 'summer_league_2013/scores/week_' + week_number + '/field_' + field_number);
      game.on('value', function(snapshot) {
        if(!snapshot.val()) 
          return;
        var home_score = snapshot.val().home_score;
        var away_score = snapshot.val().away_score;
        var home_team = snapshot.val().home_team;
        var away_team = snapshot.val().away_team;
        
        score_cell.html('<span></span>-<span></span>');
        score_cell.find('span').eq(0).text(home_score);
        score_cell.find('span').eq(1).text(away_score);
        home_team_cell.text(home_team);
        away_team_cell.text(away_team);
                  
        game.off('value');
      }); 
    },
  get_home_team_cell: function() {
    return $(this).find('td').eq(2);
  },
  get_home_team: function() {
    var home_team_cell = $(this).get_home_team_cell();
    if($(home_team_cell).find('input').length == 0) 
      return home_team_cell.text();
    else 
      return $(home_team_cell).find('input').val();
  },
  get_away_team_cell: function() {
    return $(this).find('td').eq(3);
  },
  get_away_team: function() {
    var away_team_cell = $(this).get_away_team_cell();
    if($(away_team_cell).find('input').length == 0) 
      return away_team_cell.text();
    else 
      return $(away_team_cell).find('input').val();
  },
  calculate_wins: function() {
    var home_team_name = $(this).get_home_team();
    var away_team_name = $(this).get_away_team();
    
    var scores = $(this).get_scores();
    var week_number = $(this).get_week_number();
    
    if(scores.home_score > scores.away_score) {
      var firebase_wins = new Firebase(firebase_url + 'summer_league_2013/standings/'+home_team_name+'/week'+week_number);
      firebase_wins.set({
        result: 'win',
        score: scores.home_score + '-' + scores.away_score,
        opponent: away_team_name
      });
    } else if (scores.home_score < scores.away_score) {
      var firebase_wins = new Firebase(firebase_url + 'summer_league_2013/standings/'+away_team_name+'/week'+week_number);
      firebase_wins.set({
        result: 'loss',
        score: scores.away_score + '-' + scores.home_score, 
        opponent: home_team_name
      });
    }    
  },
  get_scores: function() {
    var score_cell = $(this).get_score_cell();
    if($(score_cell).find('input').length == 0) {
      var score_text = $(score_cell).text();
      var score_parts = score_text.split('-');
      var home_score = parseInt(score_parts[0], 10);
      var away_score = parseInt(score_parts[1], 10);
    } else {
      var home_score = parseInt($(score_cell).find('input').eq(0).val(), 10);
      var away_score = parseInt($(score_cell).find('input').eq(1).val(), 10);        
    }
    return {
      home_score: home_score,
      away_score: away_score
    };
  }
});

var redirect_after_login = false;

