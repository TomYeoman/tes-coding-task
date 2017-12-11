// React
import React from 'react';
import PropTypes from 'prop-types';
// Components
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  button: {
    margin: 12,
  },
  labelStyle: {
    letterSpacing: 3,
    fontSize: 15,
  },
};

const Button = ({
  onButtonClick,
  disabled,
  label,
}) => (
  <div>
    <RaisedButton
      target="_blank"
      label={label}
      disabled={disabled}
      onClick={onButtonClick}
      style={styles.button}
      labelStyle={styles.labelStyle}
    />
  </div>
);

Button.propTypes = {
  onButtonClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};

export default Button;
