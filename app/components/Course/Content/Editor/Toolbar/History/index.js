import React, {
  Component,
  PropTypes,
} from 'react';
import { EditorState } from 'draft-js';
import styles from './styles.css';
import Option from '../Formats/Option';

class History extends Component {

  constructor(props) {
    super(props);
    this.state = {
      undo: false,
      redo: false,
    };
  }

  componentWillMount() {
    const {
      editorState,
    } = this.props;
    if (editorState) {
      this.setState({
        undo: editorState
          .getUndoStack()
          .size === 0,
        redo: editorState
          .getRedoStack()
          .size === 0,
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
        undo: props
          .editorState
          .getUndoStack()
          .size === 0,
        redo: props
          .editorState
          .getRedoStack()
          .size === 0,
      });
    }
  }

  undo = () => {
    const {
      editorState,
      changeEditorState,
    } = this.props;
    const newState =
      EditorState
        .undo(editorState);
    if (newState) {
      changeEditorState(
        newState,
        true
      );
    }
  };

  redo = () => {
    const {
      editorState,
      changeEditorState,
    } = this.props;
    const newState =
      EditorState
        .redo(editorState);
    if (newState) {
      changeEditorState(
        newState,
        true
      );
    }
  };

  render() {
    const {
      undo,
      redo,
    } = this.state;
    return (
      <span className={styles.history}>
        {[{
          icon: 'undo',
          onClick: this.undo,
          disabled: undo,
        }, {
          icon: 'redo',
          onClick: this.redo,
          disabled: redo,
        }].map((data, index) =>
          <Option
            key={index}
            {...data}
          >
            <img
              src={require( // eslint-disable-line
                `components/UI/SVG/${data.icon}.svg`
              )}
              role="presentation"
              className={styles.icon}
            />
          </Option>
        )
      }
      </span>
    );
  }
}

History.propTypes = {
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default History;
