import React, { PropTypes, Component } from 'react';
import {
  Card as AntCard,
  Modal,
  Input,
} from 'antd';
import { Entity } from 'draft-js';
import styles from './styles.css';

class Image extends Component {

  constructor(props) {
    super(props);
    this.state = {
      promt: {
        visible: false,
      },
    };
  }

  /* shouldComponentUpdate(
    nextProps,
    nextState
  ) {
    return !isEqual(
      this.state,
      nextState
    );
  }*/

  /* editContent = () => {
    this.setState({
      promt: {
        open: true,
        value: this
          .state
          .source,
      },
    });
  }*/

  /* modifyContent = () => {
    const {
      value: source,
    } = this.state.promt;
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          source,
          text: this
            .state
            .text,
        },
      }
    );
    this.setState({
      source,
      promt: {
        open: false,
      },
    });
  }*/

  editContent = (event) => {
    event.preventDefault();
    this.setState({
      promt: {
        ...this.props.content,
        visible: true,
      },
    });
  }

  modifyContent = () => {
    const { promt: content } = this.state;
    Entity.replaceData(
      this.props.entityKey, {
        content,
      }
    );
    this.setState({
      promt: {
        visible: false,
      },
    });
  }

  handleCancel = () => {
    this.setState({
      promt: {
        visible: false,
      },
    });
  }

  inputChange = (type) => (e) => {
    this.setState({
      promt: {
        ...this.state.promt,
        [type]: e.target.value,
      },
    });
  }

  render() {
    const {
      promt,
    } = this.state;
    const { url, title } = this.props.content;
    return (
      <div>
        {promt.visible && <Modal
          title="Параметры видео"
          visible={promt.visible}
          onOk={this.modifyContent}
          onCancel={this.handleCancel}
          okText="OK"
          cancelText="Отмена"
        >
          <div className={styles.input}>
            <Input
              placeholder="Ссылка на видео"
              value={promt.url}
              onChange={this.inputChange('url')}
            />
          </div>
          <div className={styles.input}>
            <Input
              placeholder="Заголовок видео"
              value={promt.title}
              onChange={this.inputChange('title')}
            />
          </div>
        </Modal>}
        <AntCard
          className={styles.card}
          bodyStyle={{ padding: 0 }}
          onDoubleClick={!this.context.isPlayer && this.editContent}
        >
          <img
            alt="example"
            src={url}
          />
          <div className={styles.text}>
            <p>{title}</p>
          </div>
        </AntCard>
      </div>
    );
  }
}

Image.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

Image.defaultProps = {
  content: {
    title: 'Изображение',
    url: 'https://img3.goodfon.ru/original/1440x900/c/d3/uluru-ayers-rock-sandstone.jpg',
  },
};

Image.contextTypes = {
  isPlayer: PropTypes.bool,
};

export default Image;
