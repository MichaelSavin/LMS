import React, { Component } from 'react';
import { connect } from 'react-redux';
import stateDataSelector from './selectors';

export class App extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        ✨
      </div>
    );
  }
}

const mapStateToProps = '';

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
