import React, {
  Component,
  PropTypes,
} from 'react';
import {
  getSelectionInlineStyle,
} from 'draftjs-utils';
import { Icon as AntIcon } from 'antd';
import {
  Modifier,
  RichUtils,
  EditorState,

  convertToRaw,
  CompositeDecorator,
  Editor,
  Entity,
} from 'draft-js';
import Icon from 'components/UI/Icon';
import styles from './styles.css';
import Option from '../Option';

function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

class LinkOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowInput: false,
      linkValue: '',
      selection: '',
    };
  }

  showInput = () => {
    this.context.toggleReadOnly();
    this.setState({
      isShowInput: !this.state.isShowInput,
      selection: this.props.editorState.getSelection(),
    });
  }

  confirmLink = () => {
    this.context.toggleReadOnly();
    const { editorState, changeEditorState } = this.props;
    const { linkValue, selection } = this.state;
    console.log(linkValue);
    const entityKey = Entity.create('LINK', 'MUTABLE', { url: linkValue });
    return changeEditorState(
      RichUtils.toggleLink(
        editorState,
        selection,
        entityKey
      )
    );

    // const {
    //   editorState,
    //   changeEditorState,
    // } = this.props;
    // const newState = RichUtils
    //   .toggleInlineStyle(
    //     editorState,
    //     style
    //   );
    // changeEditorState(
    //   style === 'SUBSCRIPT' || style === 'SUPERSCRIPT'
    //     ? EditorState.push(
    //         newState,
    //         Modifier.removeInlineStyle(
    //           newState.getCurrentContent(),
    //           newState.getSelection(),
    //           style === 'SUBSCRIPT'
    //             ? 'SUPERSCRIPT'
    //             : 'SUBSCRIPT',
    //         ),
    //         'change-inline-style'
    //       )
    //     : newState
    // );
  }

  inputChange = (e) => {
    console.log(e.target.value);
    this.setState({
      linkValue: e.target.value,
    });
  }

  render() {
    const {
      isShowInput,
      linkValue,
    } = this.state;
    const {
      inPopup,
    } = this.props;
    return (
      isShowInput ?
        <div className={styles.input}>
          <input
            value={linkValue}
            type="text"
            autoFocus
            onChange={this.inputChange}
          />
          <AntIcon
            type="check"
            onClick={this.confirmLink}
            className={styles.confirm}
          />
        </div>
          :
        <Option
          value="LINK"
          // active={textStyles.LINK}
          onClick={this.showInput}
          inPopup={inPopup}
        >
          <span className={styles.icon}>
            <Icon type="link" size={16} />
          </span>
        </Option>
    );
  }
}

LinkOption.propTypes = {
  inPopup: PropTypes.bool,
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

LinkOption.contextTypes = {
  toggleReadOnly: PropTypes.func.isRequired,
};

export default LinkOption;
