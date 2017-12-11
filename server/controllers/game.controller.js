const httpStatus = require('http-status');
const { omit } = require('lodash');

const uuidv4 = require('uuid/v4');
const moment = require('moment');
const _ = require('lodash');

// We'll store all games in memory for now, We could hook up a DB etc to store scores
// after if we wanted.
// An "arena" is a per client basis, IE if we have 1 tab open,
// we'll be assigned an arena which we could have 1 or more courts assigned to
let tennisGameStore = {};

exports.attemptSwing = (req, res, next) => {
  const { arenaID, courtID, playerID } = req.params;
  const tennisScores = ['0', '15', '30', '40', 'ADVANTAGE', 'WIN'];

  // Find player who tried to swing
  const currPlayer = tennisGameStore[arenaID].courts[courtID].players[playerID];

  // Catch error
  if (!currPlayer) {
    res.status(200);
    res.json({ error: 'No player found matching the provided details' });
    return;
  }

  // Find opponent
  const opponentID = Object.keys(tennisGameStore[arenaID].courts[courtID].players)
    .filter(currPlayerID => playerID !== currPlayerID);
  const opponent = tennisGameStore[arenaID].courts[courtID].players[opponentID];

  // Perform a few checks to make sure no moves are
  // taken out of turn / if we've got a winner already
  if (currPlayer.score === 'WIN' || opponent.score === 'WIN' || !currPlayer.isTurn) {
    return;
  }

  // 50/50 chance of landing hit
  const hasLandedHit = Math.random(0, 1) > 0.5;

  if (hasLandedHit) {
    // Work out potential new score
    const newScoreIndex = (tennisScores.indexOf(currPlayer.score)) + 1;

    // If other player is @ advatage, knock them back to deuce
    if (currPlayer.score === '40' && opponent.score === 'ADVANTAGE') {
      opponent.score = '40';
    }

    // Update our own score
    currPlayer.score = tennisScores[newScoreIndex];
  } else {
    // If we miss and we're @ advantage knock us down to deuce
    if (currPlayer.score === 'ADVANTAGE') {
      currPlayer.score = '40';
    }
  }

  // dissallow any more moves before game reset after win
  if (currPlayer.score === 'WIN') {
    currPlayer.isTurn = false;
    opponent.isTurn = false;
  } else {
    // Otherwise return control to opponent
    currPlayer.isTurn = false;
    opponent.isTurn = true;
  }

  res.status(200);
  res.json({ hasLandedHit });
  // Update the game in the global store ( Again this would normally be handed in DB)
  // but for this task we'll handle it in memory
  tennisGameStore[arenaID].courts[courtID].players[playerID] = currPlayer;
  tennisGameStore[arenaID].courts[courtID].players[opponentID] = opponent;
};

exports.createGame = (req, res, next) => {
  const { courtAmount } = req.params;
  const arenaID = uuidv4();

  // Create X amount of courts, with 2 players in each
  const courtObj = {};

  for (let i = 0; i < courtAmount; i++) {
    courtObj[uuidv4()] = createCourtPlayers();
  }

  // Merge new game into store
  tennisGameStore = Object.assign(tennisGameStore, {
    [arenaID]: {
      time: moment().format(),
      courts: courtObj,
    },
  });

  // Pass the ID of the created arena back to user
  res.status(201);
  res.json({ arenaID });
};

// Given an arena + court ID, return the current scores for the players in it
exports.getScores = (req, res, next) => {
  const { arenaID, courtID } = req.params;

  // If we can't find a matching arena no need to bother checking for courts
  if (!tennisGameStore[arenaID]) {
    res.json({ error: 'No arena found matching the ID provided' });
    res.status(200);
    return;
  }

  // CourtID is optional, Send back all arena data if we've excluded it
  if (courtID) {
    res.json({
      id: courtID,
      players: tennisGameStore[arenaID].courts[courtID].players,
    });
  } else {
    res.json({
      arena: {
        id: arenaID,
        courts: tennisGameStore[arenaID].courts,
      },
    });
  }

  res.status(200);
};

exports.resetCourt = (req, res, next) => {
  // Reset this courts players etc
  const { arenaID, courtID } = req.params;

  if (tennisGameStore[arenaID].courts[courtID]) {
    tennisGameStore[arenaID].courts[courtID] = createCourtPlayers();
    res.status(200);
    res.json({ success: `court ${courtID}: was reset sucessfully` });
  } else {
    res.json({ error: `unable to find court ${courtID}` });
    res.status(200);
  }
};


// Helpers

const createCourtPlayers = () => {
  // Assign random player to begin game
  const randomBool = Math.random(0, 1) > 0.5;
  return ({
    players: {
      [uuidv4()]: {
        name: 'Player 1',
        score: '0',
        isTurn: randomBool,
        lastActionResult: '',
      },
      [uuidv4()]: {
        name: 'Player 2',
        score: '0',
        isTurn: !randomBool,
        lastActionResult: '',
      },
    },
  });
};
