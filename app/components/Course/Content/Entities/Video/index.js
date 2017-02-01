import React, { PropTypes, Component } from 'react';
// import AntPromt from 'components/UI/Promt';
import ReactPlayer from 'react-player';
import { Icon as AntIcon, Button, Modal, Input } from 'antd';
import { Entity, ContentState } from 'draft-js';
// import { isEqual } from 'lodash';
import styles from './styles.css';

class Video extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isTextShowen: false,
      playing: false,
      promt: {
        visible: false,
        value: null,
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
    console.log(ContentState);
    console.log(ContentState.replaceEntityData);
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

  readTogle = () => {
    this.setState({
      isTextShowen: !this.state.isTextShowen,
    });
  }

  playTogle = () => {
    this.setState({
      playing: !this.state.playing,
    });
  }

  render() {
    const {
      isTextShowen,
      playing,
      promt,
    } = this.state;
    const { url, text, size, title } = this.props.content;
    return (
      <div className={styles.video}>
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
          <div className={styles.input}>
            <Input
              placeholder="Размер видео"
              value={promt.size}
              onChange={this.inputChange('size')}
            />
          </div>
          <div className={styles.input}>
            <Input
              type="textarea" autosize={{ minRows: 2 }} placeholder="Описание видео"
              value={promt.text}
              onChange={this.inputChange('text')}
            />
          </div>
        </Modal>}
        <div className={styles.player}>
          <ReactPlayer
            url={url}
            controls={false}
            style={{ position: 'relative' }}
            playing={playing}
          />
        </div>
        <div className={styles.controls}>
          <Button
            type="primary"
            shape="circle"
            icon={playing ? 'pause' : 'caret-right'}
            size="large"
            onClick={this.playTogle}
          />
          <div className={styles.title}>
            <h3>{title}</h3>
            <div className={styles.explanations}>{size}</div>
          </div>
          <div className={styles.helpers}>
            <div className={styles.button}>
              <Button type="primary" shape="circle" icon="customer-service" size="large" disabled />
              <div className={styles.explanations}>Слушать</div>
            </div>
            <div className={styles.button}>
              <Button
                type="primary"
                shape="circle"
                icon="file-text"
                size="large"
                onClick={this.readTogle}
              />
              <div className={styles.explanations}>Читать</div>
            </div>
            <div className={styles.button}>
              <Button type="primary" shape="circle" icon="download" size="large" disabled />
              <div className={styles.explanations}>Скачать</div>
            </div>
          </div>
        </div>

        {isTextShowen && <div className={styles.text}>
          {text}
        </div>}

        <AntIcon
          type="setting"
          className={styles.icon}
          onClick={this.editContent}
        />
      </div>
    );
  }
}

Video.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    size: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

Video.defaultProps = {
  content: {
    size: '',
    text: '',
    title: '',
    url: 'https://www.youtube.com/watch?v=XFF2ECZ8m1A',
  },
};

export default Video;
