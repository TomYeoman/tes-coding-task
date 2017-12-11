// React
import React from 'react';
import PropTypes from 'prop-types';
// Components
import Paper from 'material-ui/Paper';

const style = {
  height: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
  backgroundColor: '#00bc8c',
  h1Style: {
    paddingTop: '10px',
  },
};

const paperContents = score => (
  <h1 style={style.h1Style}>{score}</h1>
);

const PlayerScore = ({ score, isTurn }) => {
  const width = score === 'ADVANTAGE' ? 300 : 100;
  return (
    <div>
      <Paper
        style={{
              ...style,
              boxShadow: isTurn ? '0 5px 25px rgba(72, 72, 72, 0.9)' : '',
              width,
          }}
        zDepth={3}
        children={paperContents(score)}
        circle
      />
    </div>
  );
};

PlayerScore.propTypes = {
  score: PropTypes.string.isRequired,
  isTurn: PropTypes.bool.isRequired,
};

export default PlayerScore;
