import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Structure from './Structure';

export class Course extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Structure {...this.props.data} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.get('course').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

Course.propTypes = {
  data: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Course);
