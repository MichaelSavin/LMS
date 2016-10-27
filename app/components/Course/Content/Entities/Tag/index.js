import React, { PropTypes, Component } from 'react';
import AntPromt from 'components/UI/Promt';
import { Tag as AntTag } from 'antd';
import { Entity } from 'draft-js';
import { isEqual } from 'lodash';
import styles from './styles.css';

class Tag extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: (Entity
        .get(this.props.entityKey)
        .getData()
        .content || {}
      ).text || 'Тег',
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

  editText = () => {
    this.setState({
      promt: {
        open: true,
        value: this
          .state
          .text,
      },
    });
  }

  modifyText = () => {
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
      promt,
    } = this.state;
    return (
      <span className={styles.tag}>
        <AntTag
          color="green"
          onDoubleClick={this.editText}
        >
          {text}
        </AntTag>
        <AntPromt
          value={promt.value}
          onSave={this.modifyText}
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
      </span>
    );
  }
}

Tag.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Tag;
