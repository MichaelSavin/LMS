import React, { Component } from 'react';
import { connect } from 'react-redux';
import stateDataSelector from './selectors';

export class Course extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        🔨
      </div>
    );
  }
}

const mapStateToProps = stateDataSelector();

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Course);

// Добавить в routes.js:
// import Course from 'components/Course';
// <Route path="/Course" component={ Course }></Route>
