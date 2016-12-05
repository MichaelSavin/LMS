import React, {
  Component,
  PropTypes,
} from 'react';
import { isEqual } from 'lodash/fp';
import { Entity } from 'draft-js';
import Preview from './Preview';
import Editor from './Editor';
// import Popup from './Popup';
import './styles.css';

class TeX extends Component {

  constructor(props) {
    super(props);
    const data = {
      default: {
        tex: 'e = mc^2',
      },
      entity: Entity
        .get(this.props.entityKey)
        .getData()
        .content,
    };
    const content =
      data.entity || data.default;
    this.state = {
      temp: content,
      modal: false,
      content,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { entityKey } = nextProps;
    if (entityKey && entityKey !== this.props.entityKey) {
      const content = Entity
        .get(entityKey)
        .getData()
        .content;

      this.setState({
        content,
      });
    }
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

  openModal = (e) => {
    e.preventDefault();
    this.setState({
      modal: true,
      temp: this
        .state
        .content,
    });
  }

  openPopup = () => {
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

  changeTeX = (event) => {
    this.setState({
      temp: {
        ...this.state.temp,
        tex: event.target.value,
      },
    });
  }

  render() {
    const {
      temp,
      modal,
      content,
    } = this.state;
    return (
      <span onDoubleClick={this.openModal}>
        {/* <Popup isPopped />*/}
        <Preview data={content} />
        <Editor
          data={temp}
          isOpen={modal}
          changeTeX={this.changeTeX}
          closeModal={this.closeModal}
          saveSettings={this.saveSettings}
        />
      </span>
    );
  }
}

TeX.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default TeX;
