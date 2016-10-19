import React, {
  PropTypes,
  Component,
} from 'react';
import { Select as AntSelect, Button as AntButton } from 'antd';
import AntPromt from 'components/UI/Promt';
import { isEqual, uniq } from 'lodash';
import { Entity } from 'draft-js';
import styles from './styles.css';

class Select extends Component {

  constructor(props) {
    super(props);
    // const {
    //   answer,
    //   options,
    // } = Entity
    //   .get(this.props.entityKey)
    //   .getData()
    //   .content;
    this.state = {
      ...props.content,
      promt: {
        open: false,
        value: null,
      },
    };
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

  editOptions = (event) => {
    event.preventDefault();
    this.setState({
      promt: {
        open: true,
        value: this
          .state
          .options
          .join(';'),
      },
    });
  }

  modifyOptions = () => {
    const options = uniq(
      this.state.promt.value.split(';')
    );
    const answer =
    this.state.answer > options.length - 1
        ? undefined
        : this.state.answer;
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          options,
          answer,
        },
      }
    );
    console.log('options ' + options, 'answer ' + answer);
    this.setState({
      options,
      answer,
      promt: {
        open: false,
      },
    });
  }

  chooseAnswer = (event) => {
    console.log('event ' + value, 'answer ' + answer);
    const {
      value: answer,
    } = event.target;
    console.log('event ' + value, 'answer ' + answer);
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          options: this
            .state
            .options,
          answer,
        },
      },
    );
    this.setState({ answer });
  }


  //
  // chooseAnswer(optionIndex) {
  //   console.log(optionIndex);
  //   const newContent = {
  //     ...this.state,
  //     answer: optionIndex,
  //   };
  //   Entity.replaceData(
  //     this.props.entityKey, {
  //       content: newContent,
  //     }
  //   );
  //   this.setState({ answer: optionIndex });
  // }

  render() {
    const {
      promt,
      answer,
      options,
    } = this.state;
    // const AntOptions = options.map((text, index) => <AntSelect.Option key={index}>{text}</AntSelect.Option>);
    return (
      <div>
        <AntSelect
          placeholder="Выберите вариант ответа"
          filterOption={false}
          onChange={this.chooseAnswer}
          defaultValue={answer}
          className={styles.select}
        >
    
          )}
        </AntSelect>
        <AntButton
          type="ghost"
          shape="circle-outline"
          icon="edit"
          onClick={this.editOptions}
        />
        <AntPromt
          value={promt.value}
          onSave={this.modifyOptions}
          visible={promt.open}
          onChange={(event) => {
            this.setState({
              promt: {
                ...promt,
                value: event
                  .target
                  .value,
              },
            });
          }}
          onCancel={() => {
            this.setState({
              promt: {
                ...promt,
                open: false,
              },
            });
          }}
        />
      </div>
    );
  }
}

Select.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
  // content: PropTypes.shape({
  //   answer: PropTypes.number,
  //   options: PropTypes.array.isRequired,
  // }).isRequired,
};

export default Select;
