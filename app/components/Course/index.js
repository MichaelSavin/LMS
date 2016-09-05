import React, { Component, PropTypes } from 'react';
import courseSelector from './selectors';
import { connect } from 'react-redux';
import Structure from './Structure';

export class Course extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Structure {...this.props.course} />
      </div>
    );
  }
}

const mapStateToProps = courseSelector();

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

Course.propTypes = {
  course: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Course);
