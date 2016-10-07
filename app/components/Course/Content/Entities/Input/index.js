import React, { PropTypes, Component } from 'react';
import AntPromt from 'components/UI/Promt';
import { Input as AntInput } from 'antd';
import { Entity } from 'draft-js';
import { isEqual } from 'lodash';
import styles from './styles.css';

class Input extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: Entity
        .get(this.props.entityKey)
        .getData()
        .content
        .value,
      promt: {
        open: false,
        value: null,
      },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState);
  }

  editValue = () => {
    this.setState({
      promt: {
        open: true,
        value: this.state.value,
      },
    });
  }

  modifyValue = () => {
    const { value } = this.state.promt;
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          value,
        },
      }
    );
    this.setState({
      value,
      promt: {
        open: false,
      },
    });
  }

  render() {
    const {
      value,
      promt,
    } = this.state;
    return (
      <div className={styles.input}>
        <AntInput
          type="text"
          onDoubleClick={this.editValue}
          style={{
            width: value.length > 30
              ? 200 * (value.length / 30)
              : 200,
          }}
          value={value}
        />
        <AntPromt
          value={promt.value}
          onSave={this.modifyValue}
          visible={promt.open}
          onChange={(event) => {
            this.setState({
              promt: {
                ...promt,
                value: event.target.value,
              },
            });
          }}
          onCancel={() => {
            this.setState({
              promt: {
                ...promt,
                open: false,
              },
            });
          }}
        />
      </div>
    );
  }
}

Input.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Input;
