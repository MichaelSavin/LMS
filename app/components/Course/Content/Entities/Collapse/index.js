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
import { Entity } from 'draft-js';
import Preview from './Preview';
import Editor from './Editor';
import './styles.css';

class Collapse extends Component {

  constructor(props) {
    super(props);
    const { content } = props;
    this.state = {
      drag: null,
      temp: content,
      modal: false,
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

  openModal = () => {
    this.setState({
      modal: true,
      temp: this
        .state
        .content,
    });
  }

  saveSettings = () => {
    const content =
      this.state.temp;
    this.setState({
      modal: false,
      content,
    });
    Entity.replaceData(
      this.props.entityKey, {
        content,
      }
    );
  }

  closeModal = () => {
    this.setState({
      modal: false,
    });
  }

  changeData = (field) => (index) => (event) => {
    this.setState({
      temp: set([
        'rows',
        index,
        field,
      ],
        event.target.value,
        this.state.temp,
      ),
    });
  }

  addRow = () => {
    this.setState({
      temp: update(
        'rows',
        (rows) => rows.concat([{
          title: 'Заголовок',
          text: 'Текст',
        }]),
        this.state.temp,
      ),
    });
  }

  removeRow = (index) => () => {
    this.setState({
      temp: update(
        'rows',
        (rows) => remove(
          (row) => rows.indexOf(
            row
          ) === index,
          rows,
        ),
        this.state.temp,
      ),
    });
  }

  dragRow = ({ oldIndex, newIndex }) => {
    this.setState({
      temp: {
        rows: arrayMove(
          this.state.temp.rows,
          oldIndex,
          newIndex,
        ),
      },
    });
  };

  render() {
    const {
      temp,
      modal,
      content,
    } = this.state;
    return (
      <div onDoubleClick={!this.context.isPlayer && this.openModal}>
        <Preview
          data={content}
        />
        <Editor
          data={temp}
          isOpen={modal}
          addRow={this.addRow}
          dragRow={this.dragRow}
          removeRow={this.removeRow}
          closeModal={this.closeModal}
          changeText={this.changeData('text')}
          changeTitle={this.changeData('title')}
          saveSettings={this.saveSettings}
        />
      </div>
    );
  }
}

Collapse.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

Collapse.defaultProps = {
  content: {
    rows: [
      { title: 'Заголовок', text: 'Текст' },
      { title: 'Заголовок', text: 'Текст' },
    ],
  },
};

Collapse.contextTypes = {
  isPlayer: PropTypes.bool,
};

export default Collapse;
