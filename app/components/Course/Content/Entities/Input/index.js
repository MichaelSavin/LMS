import React, {
  PropTypes,
  Component,
} from 'react';
import { Entity } from 'draft-js';
import styles from './styles.css';

class Input extends Component {

  constructor(props) {
    super(props);
    const { value } = Entity
      .get(this.props.entityKey)
      .getData()
      .content;
    this.state = { value };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const [
      currentValue,
      nextValue,
    ] = [
      this.props,
      nextProps,
    ].map(props =>
      props.entityKey
    ).map(entity =>
      Entity
       .get(this.props.entityKey)
       .getData(entity)
       .content
       .value
    );
    return (
      this.state.value !==
      nextState.value
    ||
      currentValue !==
      nextValue
    );
  }

  editValue(newValue) {
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          value: newValue,
        },
      }
    );
    this.setState({ value: newValue });
  }

  render() {
    return (
      <input
        type="text"
        ref="input"
        onFocus={() => { window.EditorReadOnly = true; }} // eslint-disable-line fp/no-mutation
        onBlur={() => { window.EditorReadOnly = false; }} // eslint-disable-line fp/no-mutation
        onChange={event =>
          this.editValue(
            event.target.value
          )
        }
        value={this.state.value}
        className={styles.input}
      />
    );
  }
}

Input.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Input;
