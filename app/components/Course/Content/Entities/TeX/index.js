import React, {
  Component,
  PropTypes,
} from 'react';
import { isEqual } from 'lodash/fp';
import { Entity } from 'draft-js';
import katex from 'katex';
import Preview from './Preview';
import Editor from './Editor';
import Popup from './Popup';
import './styles.css';

class TeX extends Component {

  constructor(props) {
    super(props);
    const entity = Entity
      .get(this.props.entityKey)
      .getData();
    const data = {
      default: {
        tex: 'e = mc^2',
      },
      entity: entity.content,
    };
    const { location } = entity;
    const content =
      data.entity || data.default;
    this.state = {
      temp: content,
      original: content,
      modal: false,
      popup: false,
      popupError: {},
      content,
      location,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { entityKey } = nextProps;
    if (entityKey && entityKey !== this.props.entityKey) {
      const {
        content = {
          tex: 'e = mc^2',
        },
        location,
      } = Entity
        .get(entityKey)
        .getData();
      this.setState({
        content,
        location,
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

  onSavePopup = () => {
    this.setState({
      popup: false,
      content: this.state.temp,
      original: this.state.temp,
    }, () => {
      this.saveSettings();
      this.context.removeReadOnlyFlag();
    });
  }

  onCancelPopup = () => {
    this.setState({
      popup: false,
      content: this.state.original,
      temp: this.state.original,
      popupError: {},
    }, () => {
      this.saveSettings();
      this.context.removeReadOnlyFlag();
    });
  }


  closeModal = () => {
    this.setState({
      modal: false,
    });
  }

  saveSettings = () => {
    const content =
      this.state.temp;
    const { location } = this.state;
    this.setState({
      modal: false,
      content,
    });
    Entity.replaceData(
      this.props.entityKey, {
        content, location,
      }
    );
  }

  openEdit = () => {
    const { location } = this.state;
    const { addReadOnlyFlag } = this.context;
    if (location === 'INPUT') {
      this.setState({
        popup: true,
        temp: this
          .state
          .content,
      }, addReadOnlyFlag);
    } else {
      this.setState({
        modal: true,
        temp: this
          .state
          .content,
      });
    }
  }

  changeTeX = (event) => {
    const { location } = this.state;
    const { value } = event.target;
    this.setState({
      temp: {
        ...this.state.temp,
        tex: value,
      },
    }, () => {
      if (location === 'INPUT') {
        try {
          katex.__parse(value); // eslint-disable-line no-underscore-dangle
          this.setState({
            popupError: {},
          });
        } catch (error) {
          this.setState({
            popupError: error,
          });
        }
        this.saveSettings();
      }
    });
  }

  render() {
    const {
      temp,
      modal,
      popup,
      content,
      popupError,
    } = this.state;
    return (
      <span onDoubleClick={this.openEdit} style={{ position: 'relative' }}>
        <Popup
          popupError={popupError}
          popup={popup}
          onCancel={this.onCancelPopup}
          onSave={this.onSavePopup}
          data={temp}
          changeTeX={this.changeTeX}
        />
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
TeX.contextTypes = {
  addReadOnlyFlag: PropTypes.func,
  removeReadOnlyFlag: PropTypes.func,
};

export default TeX;
