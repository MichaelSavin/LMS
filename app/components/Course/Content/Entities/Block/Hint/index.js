import React, { Component, PropTypes } from 'react';
import AntPromt from 'components/UI/Promt';
import { isEqual } from 'lodash';
import { Entity } from 'draft-js';
import styles from './styles.css';

class Hint extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...props.content,
      hidden: true,
      used: false,
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

  toggleHint = () => {
    const {
      used,
      hidden,
    } = this.state;
    this.setState({
      used: used || !hidden,
      hidden: !hidden,
    });
  }

  editHint = (event) => {
    event.preventDefault();
    this.setState({
      promt: {
        open: true,
        value: this
          .state
          .text,
      },
    });
  }

  modifyHint = () => {
    const {
      value: text,
    } = this.state.promt;
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          text,
        },
      }
    );
    this.setState({
      text,
      promt: {
        open: false,
      },
    });
  }

  render() {
    const {
      text,
      used,
      promt,
      hidden,
    } = this.state;
    return (
      <div
        className={styles.hint}
        onContextMenu={this.editHint}
      >
        <div onClick={this.toggleHint}>
          <span
            className={
              styles[
                used
                ? 'used'
                : 'unused'
              ]
            }
          >
            {hidden
              ? used
                ? 'Показать подсказку еще раз'
                : 'Показать подсказку'
              : 'Скрыть подсказку'
            }
          </span>
          {!used && hidden &&
            <span className={styles.info}>
              За использование снимается 1 балл
            </span>
          }
        </div>
        {!hidden &&
          <div className={styles.text}>
            {text}
          </div>
        }
        <AntPromt
          value={promt.value}
          onSave={this.modifyHint}
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

Hint.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    text: PropTypes.string.isRequired,
  }).isRequired,
};

export default Hint;
