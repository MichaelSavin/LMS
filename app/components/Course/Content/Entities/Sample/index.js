import React, {
  Component,
  PropTypes,
} from 'react';
import {
  set,
  update,
  remove,
  isEqual,
} from 'lodash/fp';
import {
  arrayMove,
} from 'react-sortable-hoc';
import {
  Button as AntButton,
} from 'antd';
import classNames from 'classnames';
import { Entity } from 'draft-js';
import Editor from './Editor';
import Preview from './Preview';
import styles from './styles.css';

class Sample extends Component {

  constructor(props) {
    super(props);
    const { content } = props;
    this.state = {
      temp: content,
      drag: null,
      isEditing: false,
      content,
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

  toggleEditor = () => {
    this.setState({
      temp: this.state.content,
      isEditing: !this.state.isEditing,
    });
    this.context.toggleReadOnly();
  }

  saveSettings = () => {
    const content =
      this.state.temp;
    this.setState({
      isEditing: false,
      content,
    });
    Entity.replaceData(
      this.props.entityKey, {
        content,
      }
    );
    this.context.toggleReadOnly();
  }

  changeColor = (index) => (value) => {
    this.setState({
      temp: set([
        'steps',
        index,
        'color',
      ],
        value,
        this.state.temp,
      ),
    });
  }

  changeText = (index) => (event) => {
    this.setState({
      temp: set([
        'steps',
        index,
        'text',
      ],
        event.target.value,
        this.state.temp,
      ),
    });
  }

  addStep = () => {
    this.setState({
      temp: update(
        'steps',
        (steps) => steps.concat([{
          text: 'Новое событие',
          color: 'blue',
        }]),
        this.state.temp,
      ),
    });
  }

  removeStep = (index) => () => {
    this.setState({
      temp: update(
        'steps',
        (steps) => remove(
          (step) => steps.indexOf(
            step
          ) === index,
          steps,
        ),
        this.state.temp,
      ),
    });
  }

  dragStep = ({ oldIndex, newIndex }) => {
    this.setState({
      temp: {
        steps: arrayMove(
          this.state.temp.steps,
          oldIndex, newIndex,
        ),
      },
    });
  };

  render() {
    const {
      temp,
      content,
      isEditing,
    } = this.state;
    return (
      <div
        className={classNames(
          styles.sample,
          { [styles.editing]: isEditing }
        )}
      >
        <Preview
          data={isEditing
            ? temp
            : content
          }
        />
        {isEditing &&
          <Editor
            data={temp}
            dragStep={this.dragStep}
            removeStep={this.removeStep}
            changeText={this.changeText}
            changeColor={this.changeColor}
          />
        }
        <div className={styles.actions}>
          <AntButton
            type={isEditing
              ? 'ghost'
              : 'dashed'
            }
            size={isEditing
              ? 'default'
              : 'small'
            }
            icon={isEditing
              ? 'close'
              : 'setting'
            }
            onClick={this.toggleEditor}
          >
            {isEditing
              ? 'Отменить'
              : 'Редактировать'
            }
          </AntButton>
          {isEditing &&
            <AntButton
              // size="small"
              icon="save"
              type="primary"
              style={{ marginLeft: '10px' }}
              onClick={this.saveSettings}
            >
              Сохранить
            </AntButton>
          }
        </div>
      </div>
    );
  }
}

Sample.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        image: PropTypes.string,
        color: PropTypes.oneOf([
          'blue',
          'red',
          'green',
        ]).isRequired,
      }).isRequired
    ).isRequired,
  }).isRequired,
};

Sample.defaultProps = {
  content: {
    steps: [
      { text: 'Первое событие', color: 'blue', image: '' },
      { text: 'Второе событие', color: 'blue', image: '' },
      { text: 'Третье событие', color: 'blue', image: '' },
      { text: 'Четвертое событие', color: 'blue', image: '' },
    ],
  },
};

Sample.contextTypes = {
  toggleReadOnly: PropTypes.func.isRequired,
};

export default Sample;
