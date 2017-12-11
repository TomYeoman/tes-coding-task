// React
import React from 'react';
import PropTypes from 'prop-types';
// Components
import Snackbar from 'material-ui/Snackbar';

const styles = {
  color: '#fff',
  padding: 50,
  fontSize: 15,
};

export default class Toast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  // Whenever we recieve new props, Re-open the toast
  componentWillReceiveProps() {
    this.setState({ open: true });
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  render() {
    const { bodyStyle, toastText } = this.props;
    return (
      <div>
        <Snackbar
          open={this.state.open}
          message={<span style={styles}>{toastText}</span>}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
          bodyStyle={bodyStyle}
        />
      </div>
    );
  }
}

Toast.propTypes = {
  bodyStyle: PropTypes.object.isRequired,
  toastText: PropTypes.string.isRequired,
};
