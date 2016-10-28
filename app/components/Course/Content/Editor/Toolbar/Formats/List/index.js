import React, {
  Component,
  PropTypes,
} from 'react';
import {
  RichUtils,
} from 'draft-js';
import {
  // changeDepth,
  getSelectedBlocksType,
} from 'draftjs-utils';
import styles from './styles.css';
import Option from '../Option';

class List extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: {},
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

  toggleType = (type) => {
    const {
      editorState,
      changeEditorState,
    } = this.props;
    const newState = RichUtils
      .toggleBlockType(
        editorState,
        type,
      );
    if (newState) {
      changeEditorState(newState);
    }
  };

  // adjustDepth = (adjustment) => {
  //   const {
  //     editorState,
  //     changeEditorState,
  //   } = this.props;
  //   const newState = changeDepth(
  //     editorState,
  //     adjustment,
  //     4,
  //   );
  //   if (newState) {
  //     changeEditorState(
  //       newState,
  //       true
  //     );
  //   }
  // };

  render() {
    const { type } = this.state;
    return (
      <div className={styles.list}>
        {[{
          icon: 'list-ordered',
          value: 'unordered-list-item',
          active: type === 'unordered-list-item',
          onClick: this.toggleType,
        }, {
          icon: 'list-unordered',
          value: 'ordered-list-item',
          active: type === 'ordered-list-item',
          onClick: this.toggleType,
        // }, {
        //   icon: 'indent',
        //   onClick: () => this.adjustDepth(1),
        // }, {
        //   icon: 'outdent',
        //   onClick: () => this.adjustDepth(-1),
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
      </div>
    );
  }
}

List.propTypes = {
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default List;
