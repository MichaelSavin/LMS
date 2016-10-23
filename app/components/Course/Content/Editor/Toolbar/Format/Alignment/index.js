import React, {
  Component,
  PropTypes,
} from 'react';
import {
  setBlockData,
  getSelectedBlocksMetadata,
} from 'draftjs-utils';
import styles from './styles.css';
import Option from '../Option';

class Alignment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      alignment: undefined,
    };
  }

  componentWillReceiveProps(props) {
    if (
      props.editorState
      !==
      this.props.editorState
    ) {
      this.setState({
        alignment:
          getSelectedBlocksMetadata(
            props.editorState
          ).get('text-align'),
      });
    }
  }

  changeAlignment = (alignment) => {
    const {
      editorState,
      changeEditorState,
    } = this.props;
    changeEditorState(
      setBlockData(
        editorState, {
          'text-align': alignment,
        }
      )
    );
  }

  render() {
    const {
      alignment,
    } = this.state;
    return (
      <div className={styles.alignment}>
        {['left',
          'center',
          'right',
          'justify',
        ].map((type, index) =>
          <Option
            key={index}
            value={type}
            active={alignment === type}
            onClick={this.changeAlignment}
            className={styles.option}
          >
            <img
              src={require( // eslint-disable-line
                `components/UI/SVG/align-${type}.svg`
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

Alignment.propTypes = {
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Alignment;
