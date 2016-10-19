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
    // console.log(props);
    const {
      answer,
      options,
    } = Entity
      .get(this.props.entityKey)
      .getData()
      .content;
    console.log(options);
    this.state = {
      ...props.content,
      answer,
      options,
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

  chooseAnswer = (value) => {
    console.log(value);
    // const {
    //   value: answer,
    // } = event.target;
    const answer = value;
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
    // console.log('answer ' + answer);
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
    console.log('options ' + options + 'answer ' + answer);
    const AntOptions = options.map((text, index) => <AntSelect.Option key={index} value={text}>{text}</AntSelect.Option>);
    return (
      <div>
        <AntSelect
          placeholder="Выберите вариант ответа"
          filterOption={false}
          onChange={this.chooseAnswer}
          defaultValue={answer}
          className={styles.select}
        >
          {AntOptions}
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
