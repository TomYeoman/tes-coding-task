// React
import React from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';
import { attemptSwing, getLatestScores, resetCourtScore } from '../../redux/modules/tennisGame';
// Components
import PlayerProfile from './PlayerProfile';
import PlayerScore from './PlayerScore';
import Button from '../Common/Button';

const PlayerContainer = ({
  name,
  score,
  playerID,
  isTurn,
  courtID,
  arenaID,
  attemptSwingButtonClick,
  fetchLatestScores,
  resetCourtButtonClick,
}) => {
  // Handle wins
  if (score === 'WIN') {
    return (
      <div className="text-center">
        <h1>{name} won!</h1>
        <Button
          onButtonClick={async () => {
            resetCourtButtonClick({ arenaID, courtID });
            fetchLatestScores({ arenaID, courtID });
          }}
          disabled={false}
          label="PLAY AGAIN"
        />
      </div>
    );
  }
  return (
    <div>
      <PlayerProfile
        name={name}
      />
      <div className="text-center">
        <PlayerScore
          score={score}
          isTurn={isTurn}
        />
        <Button
          onButtonClick={async () => {
            attemptSwingButtonClick({ arenaID, courtID, playerID });
            fetchLatestScores({ arenaID, courtID });
          }}
          label="TAKE SWING"
          disabled={!isTurn}
        />
      </div>
    </div>
  );
};

PlayerContainer.propTypes = {
  name: PropTypes.string.isRequired,
  score: PropTypes.string.isRequired,
  playerID: PropTypes.string.isRequired,
  isTurn: PropTypes.bool.isRequired,
  courtID: PropTypes.string.isRequired,
  arenaID: PropTypes.string.isRequired,
};

const mapDispatchToProps = dispatch => ({
  attemptSwingButtonClick: ({ arenaID, courtID, playerID }) => dispatch(attemptSwing({ arenaID, courtID, playerID })),
  fetchLatestScores: ({ arenaID, courtID }) => dispatch(getLatestScores({ arenaID, courtID })),
  resetCourtButtonClick: ({ arenaID, courtID }) => dispatch(resetCourtScore({ arenaID, courtID })),
});

const mapStateToProps = (state, props) => ({
  courts: state.arena.courts,
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerContainer);
