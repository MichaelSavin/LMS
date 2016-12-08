import React, {
  Component,
  PropTypes,
} from 'react';
import { isEqual } from 'lodash/fp';
import { Entity } from 'draft-js';
import Modal from './Editor';
import Popup from './Popup';
import Preview from './Preview';
import styles from './styles.css';

class TeX extends Component {

  constructor(props) { // ✓
    super(props);
    const {
      content = {
        tex: 'E = mc^2',
      },
      location,
    } = Entity
      .get(this.props.entityKey)
      .getData();
    this.state = {
      location,
      editor: {
        open: false,
        type:
          location === 'INPUT'
            ? 'popup'
            : 'modal',
      },
      data: {
        modal: content,
        popup: content,
        component: content,
      },
    };
  }

  componentWillReceiveProps(nextProps) { // ✓ ???
    if (this.state.editor.type === 'popup') {
      this.setState({
        data: {
          ...this.state.data,
          component: Entity
            .get(nextProps.entityKey)
            .getData()
            .content,
        },
      });
    }
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

  changeTeX = (editor) => (event) => { // ✓
    const tex = event.target.value;
    this.setState({
      data: {
        ...this.state.data,
        component: editor.type === 'popup'
        ? {
          ...this.state.data.component,
          tex,
        }
        : this.state.data.component,
        [editor.type]: {
          ...this.state.data[editor.type],
          tex,
        },
      },
    });
  }

  saveData = (editor) => () => { // ✓
    this.setState({
      editor: {
        ...this
          .state
          .editor,
        open: false,
      },
      data: {
        ...this
          .state
          .data,
        component: this
          .state
          .data[editor.type],
      },
    },
      this.context.unlockDraft
    );
    Entity.mergeData(
      this.props.entityKey, {
        content: this
          .state
          .data[editor.type],
      }
    );
  }

  openEditor = (editor) => () => { // ✓
    this.setState({
      editor: {
        ...this.state.editor,
        open: true,
      },
      data: {
        ...this.state.data,
        [editor.type]: this
          .state
          .data
          .component,
      },
    },
      this.context.lockDraft
    );
  }

  closeEditor = () => { // ✓
    this.setState({
      editor: {
        ...this.state.editor,
        open: false,
      },
    },
      this.context.unlockDraft
    );
  }

  render() {
    const {
      data,
      editor,
    } = this.state;
    return (
      <span
        className={styles.tex}
        onDoubleClick={this.openEditor(editor)}
      >
        <Preview data={data.component} />
        {editor.open && React.createElement({
          modal: Modal,
          popup: Popup,
        }[editor.type], {
          data: data[editor.type],
          saveData: this.saveData(editor),
          changeTeX: this.changeTeX(editor),
          closeEditor: this.closeEditor,
        },
          null
        )}
      </span>
    );
  }
}

TeX.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

TeX.contextTypes = {
  lockDraft: PropTypes.func,
  unlockDraft: PropTypes.func,
};

export default TeX;
