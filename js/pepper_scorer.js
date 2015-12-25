// Generated by CoffeeScript 1.10.0
(function() {
  var PepperGame, Player, Team, game, player1, player2, player3, player4, suit_symbols, team1, team2,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function($) {})(jQuery);

  Team = (function() {
    function Team(player11, player21) {
      var j, len, player, ref;
      this.player1 = player11;
      this.player2 = player21;
      this.name = '';
      this.score = 0;
      this.players = [this.player1, this.player2];
      ref = this.players;
      for (j = 0, len = ref.length; j < len; j++) {
        player = ref[j];
        player.setTeam(this);
      }
    }

    Team.prototype.updatePoints = function(newPoints) {
      this.score += newPoints;
      return newPoints;
    };

    Team.prototype.setName = function(newName) {
      return this.name = newName;
    };

    Team.prototype.victorious = function(otherTeam) {
      return (this.score > otherTeam.score) && (this.score >= 42);
    };

    Team.prototype.resetScore = function() {
      return this.score = 0;
    };

    return Team;

  })();

  Player = (function() {
    function Player(name) {
      this.name = name;
      this.teamAffil = null;
    }

    Player.prototype.setTeam = function(newTeam) {
      return this.teamAffil = newTeam;
    };

    Player.prototype.setName = function(newName) {
      return this.name = newName;
    };

    return Player;

  })();

  PepperGame = (function() {
    function PepperGame(team11, team21) {
      this.team1 = team11;
      this.team2 = team21;
      this.i = 0;
      this.teams = [this.team1, this.team2];
      this.players = [this.team1.players[0], this.team2.players[0], this.team1.players[1], this.team2.players[1]];
      this.biddingTeam = null;
      this.defendingTeam = null;
      this.bidder = null;
      this.suit = null;
      this.bid = null;
    }

    PepperGame.prototype.setBidder = function(newBidder) {
      return this.bidder = newBidder;
    };

    PepperGame.prototype.setBid = function(newBid) {
      return this.bid = newBid;
    };

    PepperGame.prototype.getBidder = function() {
      var dealer;
      dealer = this.players[this.i % 4];
      $('.instruct').text(dealer.name + " deals. Who won the bid?");
      $('btn').hide();
      return $('.btn-player').show();
    };

    PepperGame.prototype.getBid = function(bidder) {
      this.bidder = bidder;
      $('.instruct').text("Okay, what did " + bidder.name + " bid?");
      $('.btn').hide();
      return $('.btn-bid').show();
    };

    PepperGame.prototype.getSuit = function(bid) {
      this.bid = bid;
      $('.instruct').text("What suit is " + this.bidder.name + "'s bid in?");
      $('.btn').hide();
      return $('.btn-suit').show();
    };

    PepperGame.prototype.getDecision = function(suit) {
      var j, len, ref, ref1, team;
      this.suit = suit;
      this.biddingTeam = this.bidder.teamAffil;
      ref = this.teams;
      for (j = 0, len = ref.length; j < len; j++) {
        team = ref[j];
        if (ref1 = this.bidder, indexOf.call(team.players, ref1) < 0) {
          this.defendingTeam = team;
        }
      }
      if (this.suit === 'clubs') {
        return this.getOutcome();
      } else {
        $('.instruct').text("What will " + this.defendingTeam.name + " do?");
        $('.btn').hide();
        $('#pass').show();
        $('#play').show();
        if (this.bid < 6) {
          $('#pass1').show();
        }
        if (this.bid < 5) {
          return $('#pass2').show();
        }
      }
    };

    PepperGame.prototype.getOutcome = function() {
      if (this.suit === 'clubs') {
        $('.instruct').text("Too bad, " + this.defendingTeam.name + ", you're playing. How many tricks did you get?");
      } else {
        $('.instruct').text(("So " + this.defendingTeam.name + " is playing! How many ") + "tricks did they get?");
      }
      $('.btn').hide();
      return $('.btn-tricks').show();
    };

    PepperGame.prototype.defChange = function(defenseTricks, theyStayed) {
      if (defenseTricks > 0) {
        if (this.bid > 6) {
          return this.bid;
        } else {
          return defenseTricks;
        }
      } else {
        if (theyStayed) {
          return -this.bid;
        } else {
          return 0;
        }
      }
    };

    PepperGame.prototype.bidChange = function(defenseTricks) {
      var tricksAvailable;
      if (this.bid < 7) {
        tricksAvailable = 6 - this.bid;
      } else {
        tricksAvailable = 0;
      }
      if (defenseTricks <= tricksAvailable) {
        return this.bid;
      } else {
        return -this.bid;
      }
    };

    PepperGame.prototype.updateScores = function(bidder, bid, suit, team1Change, team2Change) {
      var dealer, partialSet, pepper, wasSet;
      this.teams[0].updatePoints(team1Change);
      this.teams[1].updatePoints(team2Change);
      dealer = this.players[this.i % 4];
      pepper = false;
      if (this.i < 4) {
        pepper = true;
      }
      partialSet = false;
      wasSet = false;
      if (team1Change < 0) {
        if (this.teams[0] === this.defendingTeam) {
          if (this.suit === 'clubs') {
            partialSet = true;
          } else {
            wasSet = true;
          }
        } else {
          if (pepper) {
            partialSet = true;
          } else {
            wasSet = true;
          }
        }
      }
      if (team2Change < 0) {
        if (this.teams[1] === this.defendingTeam) {
          if (this.suit === 'clubs') {
            partialSet = true;
          } else {
            wasSet = true;
          }
        } else {
          if (pepper) {
            partialSet = true;
          } else {
            wasSet = true;
          }
        }
      }
      $('#score tr:last').after(("<tr><td>" + (this.i + 1) + "</td><td>" + dealer.name + "</td>") + ("<td>" + bidder + "-" + bid + suit + "</td><td>" + this.teams[0].score + "</td>") + ("<td>" + this.teams[1].score + "</td></tr>"));
      if (wasSet) {
        $('#score tr:last').addClass('danger');
      }
      if (partialSet) {
        $('#score tr:last').addClass('warning');
      }
      if (this.teams[0].victorious(this.teams[1])) {
        this.triggerVictory(this.teams[0]);
      }
      if (this.teams[1].victorious(this.teams[0])) {
        return this.triggerVictory(this.teams[1]);
      } else {
        this.i += 1;
        $('.btn').hide();
        this.biddingTeam = null;
        this.defendingTeam = null;
        this.bidder = null;
        this.suit = null;
        this.bid = null;
        if (this.i < 4) {
          this.bidder = this.players[(this.i + 1) % 4];
          this.bid = 4;
          $('.instruct').text((this.players[i % 4] + " deals and " + this.bidder.name + " ") + "automaticlaly bids 4. What suit is it in?");
          return $('.btn-suit').show();
        } else {
          $('.instruct').text(this.players[this.i % 4].name + " deals. Who won the bid?");
          return $('.btn-player').show();
        }
      }
    };

    PepperGame.prototype.triggerVictory = function(team) {
      $('.instruct').text(team.name + " has won the game!");
      $('.btn').hide();
      return $('#btn-restart').show();
    };

    PepperGame.prototype.restart = function() {
      var dealer, j, len, ref, team;
      this.i = 0;
      ref = this.teams;
      for (j = 0, len = ref.length; j < len; j++) {
        team = ref[j];
        team.resetScore();
      }
      this.bidder = this.players[1];
      this.bid = 4;
      dealer = this.players[0];
      $('.instruct').text((dealer.name + " deals and " + this.bidder.name + " ") + "automaticlaly bids 4. What suit is it in?");
      $('.btn').hide();
      return $('.btn-suit').show();
    };

    return PepperGame;

  })();

  player1 = new Player('player1');

  player2 = new Player('player2');

  player3 = new Player('player3');

  player4 = new Player('player4');

  team1 = new Team(player1, player3);

  team2 = new Team(player2, player4);

  game = new PepperGame(team1, team2);

  suit_symbols = {
    'clubs': '&#9827;',
    'diamonds': '&#9830;',
    'spades': '&#9824;',
    'hearts': '&#9829;',
    'no trump': '&#8709;'
  };

  $(document).ready(function() {
    $('#name-submit').click(function() {
      player1.setName($('#player-1-name').val());
      player2.setName($('#player-2-name').val());
      player3.setName($('#player-3-name').val());
      player4.setName($('#player-4-name').val());
      $('#team-1-prompt').text(player1.name + " and " + player3.name + "'s team");
      $('#team-2-prompt').text(player2.name + " and " + player4.name + "'s team");
      $('#player-1').text(player1.name);
      $('#player-2').text(player2.name);
      $('#player-3').text(player3.name);
      $('#player-4').text(player4.name);
      $('.names').toggleClass('hidden');
      return $('.teams').toggleClass('hidden');
    });
    $('#team-submit').click(function() {
      team1.setName($('#team-1-name').val());
      team2.setName($('#team-2-name').val());
      $('.team-1').text(team1.name);
      $('.team-2').text(team2.name);
      $('.teams').toggleClass('hidden');
      $('.game').toggleClass('hidden');
      game.setBidder(game.players[(game.i + 1) % 4]);
      game.setBid(4);
      $('.instruct').text((game.players[game.i % 4] + " deals and ") + (game.bidder.name + " automaticlaly bids 4. What suit is it in?"));
      $('.btn').hide();
      return $('.btn-suit').show();
    });
    $(' #player-1').click(function() {
      return game.getBid(player1);
    });
    $(' #player-2').click(function() {
      return game.getBid(player2);
    });
    $(' #player-3').click(function() {
      return game.getBid(player3);
    });
    $(' #player-4').click(function() {
      return game.getBid(player4);
    });
    $(' #player-no').click(function() {
      return game.updateScores('Pass', '', '', 0, 0);
    });
    $('#bid-4').click(function() {
      return game.getSuit(4);
    });
    $('#bid-5').click(function() {
      return game.getSuit(5);
    });
    $('#bid-6').click(function() {
      return game.getSuit(6);
    });
    $('#bid-7').click(function() {
      return game.getSuit(7);
    });
    $('#bid-14').click(function() {
      return game.getSuit(14);
    });
    $('#clubs').click(function() {
      return game.getDecision('clubs');
    });
    $('#diamonds').click(function() {
      return game.getDecision('diamonds');
    });
    $('#spades').click(function() {
      return game.getDecision('spades');
    });
    $('#hearts').click(function() {
      return game.getDecision('hearts');
    });
    $('#no-trump').click(function() {
      return game.getDecision('no trump');
    });
    $('#pass').click(function() {
      var team1Change, team2Change;
      if (game.teams[0] === game.defendingTeam) {
        team1Change = game.defChange(0, false);
        team2Change = game.bidChange(0);
      } else {
        team2Change = game.defChange(0, false);
        team1Change = game.bidChange(0);
      }
      return game.updateScores(game.bidder.name, game.bid, suit_symbols[game.suit], team1Change, team2Change);
    });
    $('#pass1').click(function() {
      var team1Change, team2Change;
      if (game.teams[0] === game.defendingTeam) {
        team1Change = game.defChange(1, false);
        team2Change = game.bidChange(1);
      } else {
        team2Change = game.defChange(1, false);
        team1Change = game.bidChange(1);
      }
      return game.updateScores(game.bidder.name, game.bid, suit_symbols[game.suit], team1Change, team2Change);
    });
    $('#pass2').click(function() {
      var team1Change, team2Change;
      if (game.teams[0] === game.defendingTeam) {
        team1Change = game.defChange(2, false);
        team2Change = game.bidChange(2);
      } else {
        team2Change = game.defChange(2, false);
        team1Change = game.bidChange(2);
      }
      return game.updateScores(game.bidder.name, game.bid, suit_symbols[game.suit], team1Change, team2Change);
    });
    $('#play').click(function() {
      return game.getOutcome();
    });
    $('#0-tricks').click(function() {
      var team1Change, team2Change;
      if (game.teams[0] === game.defendingTeam) {
        team1Change = game.defChange(0, true);
        team2Change = game.bidChange(0);
      } else {
        team2Change = game.defChange(0, true);
        team1Change = game.bidChange(0);
      }
      return game.updateScores(game.bidder.name, game.bid, suit_symbols[game.suit], team1Change, team2Change);
    });
    $('#1-tricks').click(function() {
      var team1Change, team2Change;
      if (game.teams[0] === game.defendingTeam) {
        team1Change = game.defChange(1, true);
        team2Change = game.bidChange(1);
      } else {
        team2Change = game.defChange(1, true);
        team1Change = game.bidChange(1);
      }
      return game.updateScores(game.bidder.name, game.bid, suit_symbols[game.suit], team1Change, team2Change);
    });
    $('#2-tricks').click(function() {
      var team1Change, team2Change;
      if (game.teams[0] === game.defendingTeam) {
        team1Change = game.defChange(2, true);
        team2Change = game.bidChange(2);
      } else {
        team2Change = game.defChange(2, true);
        team1Change = game.bidChange(2);
      }
      return game.updateScores(game.bidder.name, game.bid, suit_symbols[game.suit], team1Change, team2Change);
    });
    $('#3-tricks').click(function() {
      var team1Change, team2Change;
      if (game.teams[0] === game.defendingTeam) {
        team1Change = game.defChange(3, true);
        team2Change = game.bidChange(3);
      } else {
        team2Change = game.defChange(3, true);
        team1Change = game.bidChange(3);
      }
      return game.updateScores(game.bidder.name, game.bid, suit_symbols[game.suit], team1Change, team2Change);
    });
    $('#4-tricks').click(function() {
      var team1Change, team2Change;
      if (game.teams[0] === game.defendingTeam) {
        team1Change = game.defChange(4, true);
        team2Change = game.bidChange(4);
      } else {
        team2Change = game.defChange(4, true);
        team1Change = game.bidChange(4);
      }
      return game.updateScores(game.bidder.name, game.bid, suit_symbols[game.suit], team1Change, team2Change);
    });
    $('#5-tricks').click(function() {
      var team1Change, team2Change;
      if (game.teams[0] === game.defendingTeam) {
        team1Change = game.defChange(5, true);
        team2Change = game.bidChange(5);
      } else {
        team2Change = game.defChange(5, true);
        team1Change = game.bidChange(5);
      }
      return game.updateScores(game.bidder.name, game.bid, suit_symbols[game.suit], team1Change, team2Change);
    });
    $('#6-tricks').click(function() {
      var team1Change, team2Change;
      if (game.teams[0] === game.defendingTeam) {
        team1Change = game.defChange(6, true);
        team2Change = game.bidChange(6);
      } else {
        team2Change = game.defChange(6, true);
        team1Change = game.bidChange(6);
      }
      return game.updateScores(game.bidder.name, game.bid, suit_symbols[game.suit], team1Change, team2Change);
    });
    return $('#btn-restart').click(function() {
      $('#score tr').hide();
      return game.restart();
    });
  });

}).call(this);
