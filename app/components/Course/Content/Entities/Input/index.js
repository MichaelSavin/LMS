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

  editValue() {
    const currentValue = this.state.value;
    const newValue = prompt(
      'Редактирование значения',
      currentValue
    ) || currentValue;
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
        onDoubleClick={() => this.editValue()}
        className={styles.input}
        onChange={(event) => {
          this.setState({
            value: event.target.value,
          });
        }}
        value={this.state.value}
      />
    );
  }
}

Input.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Input;
