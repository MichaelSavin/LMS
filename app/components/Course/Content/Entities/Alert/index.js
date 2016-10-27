import React, { PropTypes, Component } from 'react';
import AntPromt from 'components/UI/Promt';
import { Alert as AntAlert } from 'antd';
import { Entity } from 'draft-js';
import { isEqual } from 'lodash';
import styles from './styles.css';

class Alert extends Component {

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

  editMessage = () => {
    this.setState({
      promt: {
        open: true,
        value: this
          .state
          .message,
      },
    });
  }

  modifyMessage = () => {
    const {
      value: message,
    } = this.state.promt;
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          message,
        },
      }
    );
    this.setState({
      message,
      promt: {
        open: false,
      },
    });
  }

  render() {
    const {
      promt,
      message,
    } = this.state;
    return (
      <div
        className={styles.alert}
        onDoubleClick={this.editMessage}
      >
        <AntAlert
          message={message}
          type="info"
          showIcon
        />
        <AntPromt
          value={promt.value}
          onSave={this.modifyMessage}
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

Alert.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }).isRequired,
};

Alert.defaultProps = {
  content: {
    message: 'Обратите внимание',
  },
};

export default Alert;
