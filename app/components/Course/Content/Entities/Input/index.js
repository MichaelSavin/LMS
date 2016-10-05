import React, {
  PropTypes,
  Component,
} from 'react';
import { Entity } from 'draft-js';
import { Input as AntInput } from 'antd';
// import styles from './styles.css';

class Input extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: Entity
        .get(this.props.entityKey)
        .getData()
        .content
        .value,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.value !==
      nextState.value;
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
    const { value } = this.state;
    return (
      <AntInput
        type="text"
        onDoubleClick={() => this.editValue()}
        style={{
          width: value.length > 30
            ? 200 * (value.length / 30)
            : 200,
        }}
        value={value}
      />
    );
  }
}

Input.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Input;
