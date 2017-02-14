import React, { Component, PropTypes } from 'react';
import { Transfer as AntTransfer } from 'antd';
import AntPromt from 'components/UI/Promt';
import { isEqual, uniq } from 'lodash';
import { Entity } from 'draft-js';
import styles from './styles.css';

class Transfer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      options: props
        .content
        .options
        .map((option, index) => ({
          key: index,
          title: option,
          chosen: false,
        })),
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

  editOptions = (event) => {
    event.preventDefault();
    this.setState({
      promt: {
        open: true,
        value: this
          .state
          .options
          .map((option) =>
            option.title
          ).join('\n'),
      },
    });
  }

  modifyOptions = () => {
    const options = uniq(
      this
      .state
      .promt
      .value
      .split('\n')
    );
    const keys = this
      .state
      .keys
      .filter((key) =>
        key < options.length
      );
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          keys,
          options,
          titles: this.state.titles,
        },
      }
    );
    this.setState({
      keys,
      options: options
        .map((option, index) => ({
          key: index,
          title: option,
          chosen: false,
        })),
      promt: {
        open: false,
      },
    });
  }

  moveOption = (keys) => {
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          keys,
          options: this
            .state
            .options
            .map((option) =>
              option.title
            ),
          titles: this.state.titles,
        },
      }
    );
    this.setState({ keys });
  }

  render() {
    const {
      keys,
      promt,
      titles,
      options,
    } = this.state;
    return (
      <div
        className={styles.checkbox}
        onContextMenu={this.editOptions}
      >
        <AntTransfer
          titles={titles}
          render={(item) => item.title}
          onChange={this.moveOption}
          targetKeys={keys}
          dataSource={options}
          notFoundContent="Список пуст"
        />
        <AntPromt
          type="textarea"
          value={promt.value}
          onSave={this.modifyOptions}
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

Transfer.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    keys: PropTypes.array.isRequired,
    titles: PropTypes.array.isRequired,
    options: PropTypes.array.isRequired,
  }).isRequired,
};

Transfer.defaultProps = {
  content: {
    keys: [],
    titles: [
      'Бельгия',
      'Швейцария',
    ],
    options: [
      'Берн',
      'Лозанна',
      'Давос',
      'Базель',
      'Брюгге',
      'Льеж',
      'Гент',
      'Шарлеруа',
    ],
  },
};

export default Transfer;
