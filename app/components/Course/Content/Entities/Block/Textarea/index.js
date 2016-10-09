import React, { PropTypes, Component } from 'react';
import AntPromt from 'components/UI/Promt';
import { Input as AntInput } from 'antd';
import { Entity } from 'draft-js';
import { isEqual } from 'lodash';
import styles from './styles.css';

class Textarea extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...props.content,
      promt: {
        open: false,
        value: null,
      },
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

  editValue = () => {
    this.setState({
      promt: {
        open: true,
        value: this
          .state
          .value,
      },
    });
  }

  modifyValue = () => {
    const {
      value,
    } = this.state.promt;
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
      <div className={styles.textarea}>
        <AntInput
          type="textarea"
          value={value}
          autosize={{ minRows: 4 }}
          onDoubleClick={this.editValue}
        />
        <AntPromt
          type="textarea"
          value={promt.value}
          onSave={this.modifyValue}
          visible={promt.open}
          onChange={(event) => {
            this.setState({
              promt: {
                ...promt,
                value: event
                  .target
                  .value,
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

Textarea.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    value: PropTypes.string.isRequired,
  }).isRequired,
};

export default Textarea;
