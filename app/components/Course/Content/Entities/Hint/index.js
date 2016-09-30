import React, {
  Component,
  PropTypes,
} from 'react';
import { isEqual } from 'lodash';
import { Entity } from 'draft-js';
import styles from './styles.css';

class Hint extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...props.content,
      hidden: true,
      used: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState);
  }

  toggleHint() {
    this.setState({
      used: true,
      hidden: !this.state.hidden,
    });
  }

  editHint() {
    const { entityKey } = this.props;
    const { text } = this.state;
    const newText =
      prompt('Редактирование подсказки', text)
      || text;
    Entity.replaceData(entityKey, {
      content: {
        text: newText,
      },
    });
    this.setState({
      text: newText,
    });
  }

  render() {
    const {
      text,
      used,
      hidden,
    } = this.state;
    return (
      <div
        className={styles.container}
        onContextMenu={(event) => {
          event.preventDefault();
          return this.editHint();
        }}
      >
        <div onClick={() => this.toggleHint()}>
          <span
            className={styles[
              used
              ? 'used'
              : 'unused'
            ]}
          >
            {hidden
              ? 'Показать подсказку'
              : 'Скрыть подсказку'
            }
          </span>
          {!used &&
            <span className={styles.info}>
              За использование снимается 1 балл
            </span>
          }
        </div>
        {!hidden &&
          <div className={styles.text}>
            {text}
          </div>
        }
      </div>
    );
  }
}

Hint.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    text: PropTypes.string.isRequired,
  }).isRequired,
};

export default Hint;
