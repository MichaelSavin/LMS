import React, { PropTypes, PureComponent } from 'react';
import ReactPlayer from 'react-player';
import { Button } from 'antd';
import { Entity } from 'draft-js';
import styledHoC from '../HoC';
import Edit from './Edit';
import styles from './styles.css';

class Video extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isTextShowen: false,
      playing: false,
      temp: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.actionFlag !== this.props.actionFlag && this[nextProps.actionFlag]) {
      this[nextProps.actionFlag]();
    }
  }

  onPlay = () => {
    this.setState({
      playing: true,
    });
  }

  onPause = () => {
    this.setState({
      playing: false,
    });
  }

  onEnded = () => {
    this.setState({
      playing: false,
    });
  }

  playTogle = () => {
    this.setState({
      playing: !this.state.playing,
    });
  }

  readTogle = () => {
    this.setState({
      isTextShowen: !this.state.isTextShowen,
    });
  }

  openEditor = () => {
    this.setState({
      temp: {
        ...this.props.content,
      },
    }, this.props.toggleReadOnly);
  }

  saveSettings = () => {
    const { temp: content } = this.state;
    Entity.replaceData(
      this.props.entityKey, {
        content,
      }
    );
    this.setState({
      temp: null,
    }, this.props.toggleReadOnly);
  }

  closeEditor = () => {
    this.setState({
      temp: null,
    }, this.props.toggleReadOnly);
  }

  inputChange = (type) => (e) => {
    this.setState({
      temp: {
        ...this.state.temp,
        [type]: e.target.value,
      },
    });
  }

  render() {
    const {
      isTextShowen,
      playing,
      temp,
    } = this.state;
    const { content, isReadOnly } = this.props;
    const { url, text, size, title } = temp || content;
    return (
      <div className={styles.video}>
        <div className={styles.player}>
          <ReactPlayer
            url={url}
            controls={false}
            style={{ position: 'relative' }}
            playing={playing}
            onPlay={this.onPlay}
            onPause={this.onPause}
            onEnded={this.onEnded}
          />
        </div>
        <div className={styles.controls}>
          <div>
            <Button
              className={styles.playBtn}
              type="primary"
              shape="circle"
              icon={playing ? 'pause' : 'caret-right'}
              size="large"
              onClick={this.playTogle}
            />
          </div>
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

        {(!isReadOnly && temp) && <Edit
          data={temp}
          inputChange={this.inputChange}
        />}

        {isTextShowen && <div className={styles.text}>
          {text}
        </div>}
      </div>
    );
  }
}

Video.propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  toggleReadOnly: PropTypes.func.isRequired,
  actionFlag: PropTypes.string.isRequired,
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

Video.contextTypes = {
  isPlayer: PropTypes.bool,
};

export default styledHoC(Video);
