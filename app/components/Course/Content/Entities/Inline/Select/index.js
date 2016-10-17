import React, {
  PropTypes,
  Component,
} from 'react';
import { Select as AntSelect, Button } from 'antd';
import AntPromt from 'components/UI/Promt';
import { isEqual, uniq } from 'lodash';
import { List } from 'immutable';
import { Entity } from 'draft-js';
import styles from './styles.css';

const Option = AntSelect.Option;

class Select extends Component {

  constructor(props) {
    super(props);
    const {
      options,
    } = Entity
      .get(this.props.entityKey)
      .getData()
      .content;
    this.state = {
      ...props.content,
      options: List(options),
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
      this
      .state
      .promt
      .value
      .split(';')
    );
    const answers = this
      .state
      .answers
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          options,
          answers,
        },
      }
    );
    this.setState({
      options,
      answers,
      promt: {
        open: false,
      },
    });
  }

  chooseAnswer(optionIndex) {
    const newContent = {
      ...this.state,
      answer: optionIndex,
    };
    Entity.replaceData(
      this.props.entityKey, {
        content: newContent,
      }
    );
    this.setState({ answer: optionIndex });
  }

  render() {
    const {
      promt,
      options,
      answer,
    } = this.state;
    const AntOptions = options.map((text, index) => <Option key={index}>{text}</Option>);
    return (
      <div>
        <AntSelect
          showSearch
          style={{ width: 200 }}
          placeholder="Выберите вариант ответа"
          notFoundContent=""
          contentEditable="false"
          onChange={event =>
            this.chooseAnswer(
              event.target.selectedIndex
            )
          }
          defaultValue={answer}
          className={styles.select}
        >
          {AntOptions}
        </AntSelect>
        <Button type="ghost" shape="circle-outline" icon="edit" onClick={this.editOptions} />
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
};

export default Select;
