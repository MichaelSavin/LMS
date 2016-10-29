import React, { PropTypes, Component } from 'react';
import { Switch as AntSwitch } from 'antd';
import { Entity } from 'draft-js';
import { isEqual } from 'lodash';
import styles from './styles.css';

class Switch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checked: (
        Entity
          .get(this.props.entityKey)
          .getData()
          .content || {}
        ).checked || false,
    };
  }

  shouldComponentUpdate(
    nextProps,
    nextState
  ) {
    return !isEqual(
      this.state,
      nextState
    );
  }

  toggleSwitch = (checked) => {
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          checked,
        },
      }
    );
    this.setState({ checked });
  }

  render() {
    return (
      <span className={styles.switch}>
        <AntSwitch
          checked={this.state.checked}
          onChange={this.toggleSwitch}
        />
      </span>
    );
  }
}

Switch.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Switch;
