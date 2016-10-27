import React, { PropTypes, Component } from 'react';
import AntPromt from 'components/UI/Promt';
import { Card as AntCard } from 'antd';
import { Entity } from 'draft-js';
import { isEqual } from 'lodash';
import styles from './styles.css';

class Card extends Component {

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

  editContent = () => {
    this.setState({
      promt: {
        open: true,
        value: this
          .state
          .text,
      },
    });
  }

  modifyContent = () => {
    const {
      value: text,
    } = this.state.promt;
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          text,
          title: this
            .state
            .title,
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
      title,
      promt,
    } = this.state;
    return (
      <div className={styles.card}>
        <AntCard
          title={title}
          onDoubleClick={this.editContent}
        >
          {text.split('\n')
            .map((string, index) =>
              <p key={index}>{string}</p>
          )}
        </AntCard>
        <AntPromt
          type="textarea"
          value={promt.value}
          onSave={this.modifyContent}
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

Card.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    text: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

Card.defaultProps = {
  content: {
    title: 'Информация',
    text: 'Контент',
  },
};

export default Card;
