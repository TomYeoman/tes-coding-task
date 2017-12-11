// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// redux
import { createNewGame } from './../redux/modules/tennisGame';
// Libs
import uuidv4 from 'uuid/v4';
// Components
import Player from './Player';
import Toast from './Common/Toast';
import './GameContainer.css';

class GameContainer extends Component {
  componentDidMount() {
    // Generate a new game for us on first load
    const { createNewGame, arenaID } = this.props;

    // If arenaID is defined we have persisted state so don't reload
    if (!arenaID) {
      createNewGame({
        courts: 20,
      });
    }
  }

  render() {
    // Grab our courts, then create as many as required
    const { courts, arenaID, lastHitResult } = this.props;

    if (!Object.keys(courts).length) {
      return (<h1 className="text-center">Initialising Game...</h1>);
    }

    const createPlayerSections = ({ courtID, arenaID, courts }) => {
      // For the current court, create a section for both players
      const courtPlayers = courts[courtID].players;

      return Object.keys(courtPlayers).map(playerID => (
        <div key={playerID} className="col-xs-12 col-sm-6">
          <Player
            isTurn={courtPlayers[playerID].isTurn}
            name={courtPlayers[playerID].name}
            score={courtPlayers[playerID].score}
            courtID={courtID}
            arenaID={arenaID}
            playerID={playerID}
          />
        </div>
      ));
    };

    return (
      <div>
        { /* Display any players actions as toasts ( Hit / miss the ball ) */ }
        {lastHitResult !== '' ?
          <Toast
            toastText={lastHitResult ? 'Landed swing' : 'Missed swing'}
            bodyStyle={lastHitResult ? { backgroundColor: '#28a745', textColor: '#fff' } : { backgroundColor: '#dc3545', textColor: '#fff' }}
          />
          : ''
        }

        { /* Draw X amount of courts with 2 players on each */ }
        {Object.keys(courts).map(courtID => (
          <div key={courtID} className="col-xs-12 main-container">
            {createPlayerSections({ courtID, arenaID, courts })}
          </div>
        ))}

      </div>
    );
  }
}

GameContainer.propTypes = {
  courts: PropTypes.object.isRequired,
  arenaID: PropTypes.string.isRequired,
  lastHitResult: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
  createNewGame: ({ courts }) => dispatch(createNewGame({ courts })),
});

const mapStateToProps = state => ({
  arenaID: state.arena.id,
  courts: state.arena.courts,
  lastHitResult: state.arena.lastHitResult,
});

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
// export default GameContainer;
