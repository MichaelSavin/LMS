import React, {
  PropTypes,
  Component,
} from 'react';
import { isEqual } from 'lodash';
import { Entity } from 'draft-js';
import {
  Input as AntInput,
  Modal as AntModal,
 } from 'antd';
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
      editor: {
        open: false,
        value: null,
      },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState);
  }

  changeValue = () => {
    const { value } = this.state.editor;
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          value,
        },
      }
    );
    this.setState({
      value,
      editor: {
        open: false,
      },
    });
  }

  render() {
    const {
      value,
      editor,
    } = this.state;
    return (
      <div className={styles.input}>
        <AntInput
          type="text"
          onDoubleClick={() =>
            this.setState({
              editor: {
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
        <AntModal
          title="Редактирование"
          visible={editor.open}
          onOk={this.changeValue}
          okText="Сохранить"
          cancelText="Отмена"
          onCancel={() =>
            this.setState({
              editor: {
                ...editor,
                open: false,
              },
            })
          }
        >
          <AntInput
            type="text"
            value={editor.value}
            onPressEnter={this.changeValue}
            onChange={(event) => {
              this.setState({
                editor: {
                  ...editor,
                  value: event.target.value,
                },
              });
            }}
          />
        </AntModal>
      </div>
    );
  }
}

Input.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Input;
