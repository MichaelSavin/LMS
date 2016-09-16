import React, { Component, PropTypes } from 'react';
import * as actionCreators from './actions';
import { bindActionCreators } from 'redux';
import courseSelector from './selectors';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';

import styles from './styles.css';

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
          data={data}
          actions={actions}
        />
        {children && React.cloneElement(children, { data, actions })}
      </div>
    );
  }
}

const mapStateToProps = courseSelector();

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

Course.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  children: PropTypes.element,
};

export default connect(mapStateToProps, mapDispatchToProps)(Course);
