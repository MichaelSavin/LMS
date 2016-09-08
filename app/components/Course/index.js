import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import courseSelector from './selectors';
import { connect } from 'react-redux';
import * as actions from './actions';
import Structure from './Structure';

export class Course extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Structure
          data={this.props.data}
          actions={this.props.actions}
        />
      </div>
    );
  }
}

const mapStateToProps = courseSelector();

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

Course.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Course);
