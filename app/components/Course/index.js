import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import courseSelector from './selectors';
import { connect } from 'react-redux';
import * as actions from './actions';
import Sidebar from './Sidebar';

export class Course extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Sidebar
          data={this.props.data}
          actions={this.props.actions}
        />
        {this.props.children}
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
  children: PropTypes.element,
};

export default connect(mapStateToProps, mapDispatchToProps)(Course);
