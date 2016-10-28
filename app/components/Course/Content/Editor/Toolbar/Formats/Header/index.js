import React, {
  Component,
  PropTypes,
} from 'react';
import {
  getSelectedBlocksType,
 } from 'draftjs-utils';
import { Select as AntSelect } from 'antd';
import { RichUtils } from 'draft-js';
import styles from './styles.css';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: 'unstyled',
    };
  }

  componentWillMount() {
    const {
      editorState,
    } = this.props;
    if (editorState) {
      this.setState({
        type:
          getSelectedBlocksType(
            editorState
          ),
      });
    }
  }

  componentWillReceiveProps(props) {
    if (
      props.editorState
      !==
      this.props.editorState
    ) {
      this.setState({
        type:
          getSelectedBlocksType(
            props.editorState
          ),
      });
    }
  }

  changeType = (type) => {
    const {
      editorState,
      changeEditorState,
    } = this.props;
    const newState = RichUtils
      .toggleBlockType(
        editorState,
        type
      );
    if (newState) {
      changeEditorState(
        newState
      );
    }
  };

  render() {
    const { type } = this.state;
    return (
      <div className={styles.header}>
        <AntSelect
          value={[
            'unordered-list-item',
            'ordered-list-item',
          ].includes(type)
            ? 'unstyled'
            : type === 'atomic'
              ? 'Блочный элемент'
              : type
          }
          style={{ width: 150 }}
          onChange={this.changeType}
        >
          {[{ label: 'Обычный текст', style: 'unstyled' },
            { label: 'Заголовок', style: 'header-two' },
            { label: 'Подзаголовок', style: 'header-three' },
            { label: 'Цитата', style: 'blockquote' },
          ].map(({ label, style }, index) =>
            <AntSelect.Option
              key={index}
              value={style}
            >
              <span className={styles[style]}>
                {label}
              </span>
            </AntSelect.Option>
          )}
        </AntSelect>
      </div>
    );
  }
}

Header.propTypes = {
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Header;
