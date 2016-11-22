import React, {
  Component,
  PropTypes,
} from 'react';
import {
  toggleInlineStyle,
  getSelectionCustomInlineStyle,
} from 'draftjs-utils';
// import _ from 'rc-color-picker/assets/index.css'; // eslint-disable-line
import Picker from 'rc-color-picker';
import styles from './styles.css';
import Option from '../Option';

class Color extends Component {

  constructor(props) {
    super(props);
    this.state = {
      foreground: undefined,
      background: undefined,
    };
  }

  componentWillMount() {
    const { editorState } = this.props;
    this.setState({
      foreground: (getSelectionCustomInlineStyle(
        editorState,
        ['COLOR']
      ).COLOR || 'color-#000').split('-')[1],
      background: (getSelectionCustomInlineStyle(
        editorState,
        ['BGCOLOR']
      ).BGCOLOR || 'bgcolor-#FFF').split('-')[1],
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.editorState
      !==
      this.props.editorState
    ) {
      this.setState({
        foreground: (getSelectionCustomInlineStyle(
          nextProps.editorState,
          ['COLOR'],
        ).COLOR || 'color-#000').split('-')[1],
        background: (getSelectionCustomInlineStyle(
          nextProps.editorState,
          ['BGCOLOR'],
        ).BGCOLOR || 'bgcolor-#FFF').split('-')[1],
      });
    }
  }

  changeColor = (color, type) => {
    const types = {
      foreground: 'color',
      background: 'bgcolor',
    };
    const {
      editorState,
      changeEditorState,
    } = this.props;
    const newState = toggleInlineStyle(
      editorState,
      types[type],
      `${types[type]}-${color}`
    );
    if (newState) {
      changeEditorState(newState, true);
    }
  }

  render() {
    return (
      <div className={styles.color}>
        {['foreground',
          'background',
        ].map((type, index) =>
          <Option
            key={index}
            value={type}
            onClick={() => {}}
            className={styles.option}
          >
            <Picker
              className={styles.picker}
              onChange={(picker) =>
                this.changeColor(
                  picker.color,
                  type,
                )
              }
              placement="bottomLeft"
              animation="slide-up"
              color={this.state[type]}
            >
              <img
                src={require( // eslint-disable-line
                  `components/UI/SVG/${type}.svg`
                )}
                role="presentation"
                className={styles.icon}
              />
            </Picker>
          </Option>
        )
      }
      </div>
    );
  }
}

Color.propTypes = {
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Color;
