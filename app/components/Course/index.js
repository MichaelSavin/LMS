import React, { Component } from 'react';
import { connect } from 'react-redux';
import Structure from './Structure';
import { toJS } from 'immutable';
// import Unit from './Unit';

export class Course extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Structure {...this.props.course} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  course: state.get('course').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Course);
