import React, { PropTypes, Component } from 'react';
import { isEqual } from 'lodash';
import { Entity } from 'draft-js';
import { Input as AntInput } from 'antd';
import AntPromt from 'components/UI/Promt';
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

  changeValue = () => {
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
          onDoubleClick={() =>
            this.setState({
              promt: {
                open: true,
                value,
              },
            })
          }
          style={{
            width: value.length > 30
              ? 200 * (value.length / 30)
              : 200,
          }}
          value={value}
        />
        <AntPromt
          value={promt.value}
          onSave={this.changeValue}
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
