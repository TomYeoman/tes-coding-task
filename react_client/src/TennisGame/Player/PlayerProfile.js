// React
import React from 'react';
import PropTypes from 'prop-types';
// Components
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

const styles = {
  chip: {
    margin: 4,
    padding: 10,
    width: '100%',
    fontSize: '20px',
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
  labelStyle: {
    fontSize: 20,
  },
};

const PlayerProfile = ({ name }) => (
  <div style={styles.wrapper}>
    <Chip
      style={styles.chip}
      labelStyle={styles.labelStyle}
    >
      <Avatar src="images/tennis_player.png" />
      {name}
    </Chip>
  </div>
);

PlayerProfile.propTypes = {
  name: PropTypes.string.isRequired,
};

export default PlayerProfile;
