// Libs
const { find } = require('lodash');
const rp = require('request-promise');
// Actions
const ATTEMPT_SWING = 'ATTEMPT_SWING';
const UPDATE_SCORE = 'REQUEST_SCORE';
const RECIEVED_GAME_DATA = 'RECIEVED_GAME_DATA';
const UPDATE_COURT_DATA = 'UPDATE_COURT_DATA';
const RECIEVE_SWING_RESULT = 'RECIEVE_SWING_RESULT';

// Reducer
export default function reducer(state = {
  arena: {
    lastHitResult: '',
    courts: {},
  },
}, action = {}) {
  switch (action.type) {
    case RECIEVED_GAME_DATA: {
      return {
        arena: {
          id: action.payload.arena.id,
          courts: action.payload.arena.courts,
        },
      };
    }
    case RECIEVE_SWING_RESULT: {
      return {
        arena: {
          ...state.arena,
          lastHitResult: action.payload.hasLandedHit,
        },
      };
    }
    case UPDATE_COURT_DATA: {
      return {
        arena: {
          ...state.arena,
          courts: {
            ...state.arena.courts,
            [action.payload.id]: {
              players: action.payload.players,
            },
          },
        },
      };
    }
    default: return state;
  }
}

// Action Creators

export const updateScore = (arenaID, courtID, payload) => ({
  type: UPDATE_SCORE,
  arenaID,
  courtID,
  payload,
});

export const recievedGameData = payload => ({
  type: RECIEVED_GAME_DATA, payload,
});

export const updateCourtsScores = payload => ({
  type: UPDATE_COURT_DATA, payload,
});

export const recieveSwingResult = ({ payload }) => ({
  type: RECIEVE_SWING_RESULT,
  payload,
});

// side effects, only as applicable
// e.g. thunks, epics, etc

export const createNewGame = ({ courts }) =>
  // Go ask the server to start to start a new game ( Choose how many courts we want )
  // We'll default to a single court as per spec
  async (dispatch) => {
    try {
      const createGameOptions = {
        uri: `http://localhost:4000/v1/game/create/${courts}`,
        method: 'POST',
        json: true,
      };
      const { arenaID } = await rp(createGameOptions);
      const retrieveGameOptions = {
        uri: `http://localhost:4000/v1/game/scores/${arenaID}`,
        json: true,
      };

      // Go fetch the court information and save to store
      const arenaDetails = await rp(retrieveGameOptions);
      dispatch(recievedGameData(arenaDetails));
    } catch (e) {
      console.log(`Error creating games : ${e}`);
    }
  };

export const attemptSwing = ({ arenaID, courtID, playerID }) => async (dispatch) => {
  try {
    const attemptSwingOptions = {
      uri: `http://localhost:4000/v1/game/attempt_swing/${arenaID}/${courtID}/${playerID}`,
      method: 'POST',
      json: true,
    };
      // Retrieve the status of whether we've landed the hit
    const swingResult = await rp(attemptSwingOptions);
    dispatch(recieveSwingResult({ payload: swingResult }));
  } catch (e) {
    console.log(`Error trying to swing : ${e}`);
  }
};

export const getLatestScores = ({ arenaID, courtID }) => async (dispatch) => {
  try {
    const retrieveGameOptions = {
      uri: `http://localhost:4000/v1/game/scores/${arenaID}/${courtID}`,
      json: true,
    };
    // Get latest scores for this court, and re-draw it
    const courtScores = await rp(retrieveGameOptions);
    dispatch(updateCourtsScores(courtScores));
  } catch (e) {
    console.log(`Error fetching latest scores : ${e}`);
  }
};

export const resetCourtScore = ({ arenaID, courtID }) => async () => {
  try {
    const resetGameOptions = {
      uri: `http://localhost:4000/v1/game/reset/${arenaID}/${courtID}`,
      json: true,
      method: 'POST',
    };
    // Reset court players + scores, then re-draw court
    await rp(resetGameOptions);
    getLatestScores();
  } catch (e) {
    console.log(`Error resetting court : ${e}`);
  }
};
