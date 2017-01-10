import React, {
  Component,
  PropTypes,
} from 'react';
import {
  getSelectionInlineStyle,
} from 'draftjs-utils';
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


class LinkEditorExample extends React.Component {
  constructor(props) {
    super(props);

    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);

    this.state = {
      editorState: EditorState.createEmpty(decorator),
      showURLInput: false,
      urlValue: '',
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({ editorState });
    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content));
    };

    this.promptForLink = this._promptForLink.bind(this);
    this.onURLChange = (e) => this.setState({ urlValue: e.target.value });
    this.confirmLink = this._confirmLink.bind(this);
    this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
    this.removeLink = this._removeLink.bind(this);
  }

  _promptForLink(e) {
    e.preventDefault();
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        showURLInput: true,
        urlValue: '',
      }, () => {
        setTimeout(() => this.refs.url.focus(), 0);
      });
    }
  }

  _confirmLink(e) {
    e.preventDefault();
    const {editorState, urlValue} = this.state;
    const entityKey = Entity.create('LINK', 'MUTABLE', { url: urlValue });
    this.setState({
      editorState: RichUtils.toggleLink(
        editorState,
        editorState.getSelection(),
        entityKey
      ),
      showURLInput: false,
      urlValue: '',
    }, () => {
      setTimeout(() => this.refs.editor.focus(), 0);
    });
  }

  _onLinkInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmLink(e);
    }
  }

  _removeLink(e) {
    e.preventDefault();
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null),
      });
    }
  }

  render() {
    let urlInput;
    if (this.state.showURLInput) {
      urlInput =
        <div style={styles.urlInputContainer}>
          <input
            onChange={this.onURLChange}
            ref="url"
            style={styles.urlInput}
            type="text"
            value={this.state.urlValue}
            onKeyDown={this.onLinkInputKeyDown}
            />
          <button onMouseDown={this.confirmLink}>
            Confirm
          </button>
        </div>;
    }

    return (
      <div style={styles.root}>
        <div style={{ marginBottom: 10 }}>
          Select some text, then use the buttons to add or remove links
          on the selected text.
        </div>
        <div style={styles.buttons}>
          <button
            onMouseDown={this.promptForLink}
            style={{ marginRight: 10 }}>
            Add Link
          </button>
          <button onMouseDown={this.removeLink}>
            Remove Link
          </button>
        </div>
        {urlInput}
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            placeholder="Enter some text..."
            ref="editor"
            />
        </div>
        <input
          onClick={this.logState}
          style={styles.button}
          type="button"
          value="Log State"
          />
      </div>
    );
  }
}

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

const Link = (props) => {
  const {url} = Entity.get(props.entityKey).getData();
  return (
    <a href={url} style={styles.link}>
      {props.children}
    </a>
  );
};

const styles = {
  root: {
    fontFamily: '\'Georgia\', serif',
    padding: 20,
    width: 600,
  },
  buttons: {
    marginBottom: 10,
  },
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    fontFamily: '\'Georgia\', serif',
    marginRight: 10,
    padding: 3,
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
  link: {
    color: '#3b5998',
    textDecoration: 'underline',
  },
};




class Link extends Component {

  constructor(props) {
    super(props);
    this.state = {
      styles: {},
    };
  }

  componentWillMount() {
    const {
      editorState,
    } = this.props;
    if (editorState) {
      this.setState({
        styles:
          getSelectionInlineStyle(
            editorState
          ),
      });
    }
  }

  componentWillReceiveProps(props) {
    if (
      props.editorState !==
      this.props.editorState
    ) {
      this.setState({
        styles:
          getSelectionInlineStyle(
            props.editorState
          ),
      });
    }
  }

  toggleLink = (style) => {
    const {
      editorState,
      changeEditorState,
    } = this.props;
    const newState = RichUtils
      .toggleInlineStyle(
        editorState,
        style
      );
    changeEditorState(
      style === 'SUBSCRIPT' || style === 'SUPERSCRIPT'
        ? EditorState.push(
            newState,
            Modifier.removeInlineStyle(
              newState.getCurrentContent(),
              newState.getSelection(),
              style === 'SUBSCRIPT'
                ? 'SUPERSCRIPT'
                : 'SUBSCRIPT',
            ),
            'change-inline-style'
          )
        : newState
    );
  };

  toggleStyle = (style) => {
    const {
      editorState,
      changeEditorState,
    } = this.props;
    const newState = RichUtils
      .toggleInlineStyle(
        editorState,
        style
      );
    changeEditorState(
      style === 'SUBSCRIPT' || style === 'SUPERSCRIPT'
        ? EditorState.push(
            newState,
            Modifier.removeInlineStyle(
              newState.getCurrentContent(),
              newState.getSelection(),
              style === 'SUBSCRIPT'
                ? 'SUPERSCRIPT'
                : 'SUBSCRIPT',
            ),
            'change-inline-style'
          )
        : newState
    );
  };

  render() {
    const {
      styles: textStyles,
    } = this.state;
    const {
      inPopup,
    } = this.props;
    return (
      <div className={styles.text}>
        {[{
          value: 'BOLD',
          icon: 'bold',
        }, {
          value: 'ITALIC',
          icon: 'italic',
        }, {
          value: 'UNDERLINE',
          icon: 'underline',
        }, {
          value: 'STRIKETHROUGH',
          icon: 'strikethrough',
        }, {
          value: 'CODE',
          icon: 'monospace',
        }, {
          value: 'SUPERSCRIPT',
          icon: 'superscript',
        }, {
          value: 'SUBSCRIPT',
          icon: 'subscript',
        }].map(({
          value,
          icon,
        }, index) =>
          <Option
            key={index}
            value={value}
            active={textStyles[value]}
            onClick={this.toggleStyle}
            inPopup={inPopup}
          >
            <span className={styles.icon}>
              <Icon type={icon} size={16} />
            </span>
          </Option>
        )
      }
        <Option
          value="LINK"
          active={textStyles.LINK}
          onClick={this.toggleLink}
          inPopup={inPopup}
        >
          <span className={styles.icon}>
            <Icon type="link" size={16} />
          </span>
        </Option>
      </div>
    );
  }
}

Link.propTypes = {
  inPopup: PropTypes.bool,
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Link;
