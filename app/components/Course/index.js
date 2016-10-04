import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actionCreators from './actions';
import courseSelector from './selectors';
import styles from './styles.css';
import Sidebar from './Sidebar';

class Course extends Component { // HMR
  render() {
    const {
      data,
      actions,
      children,
    } = this.props;
    return (
      <div className={styles.course}>
        <Sidebar
          data={data.toJS()}
          actions={actions}
        />
        { children && React.cloneElement(children, { data: data.toJS(), actions }) }
      </div>
    );
  }
}

const mapStateToProps = courseSelector();

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

Course.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  children: PropTypes.element,
};

export default connect(mapStateToProps, mapDispatchToProps)(Course);
