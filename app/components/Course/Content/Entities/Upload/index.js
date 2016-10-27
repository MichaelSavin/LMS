import React, { Component, PropTypes } from 'react';
import {
  Upload as AntUpload,
  Button as AntButton,
  Icon as AntIcon,
} from 'antd';
import { isEqual } from 'lodash';
// import styles from './styles.css';

class Upload extends Component {

  constructor(props) {
    super(props);
    this.state = props.content;
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

  render() {
    const {
      files,
    } = this.state;
    return (
      <div>
        <AntUpload
          defaultFileList={files}
          action={'/backend/upload'}
        >
          <AntButton type="ghost">
            <AntIcon type="upload" />
            Загрузка файлов
          </AntButton>
        </AntUpload>
      </div>
    );
  }
}

Upload.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    files: PropTypes.array.isRequired,
  }).isRequired,
};

Upload.defaultProps = {
  content: {
    files: [{
      uid: -1,
      name: 'Картинка 1.png',
      status: 'done',
      url: 'https://img3.goodfon.ru/wallpaper/middle/8/de/vincent-willem-van-gogh-wheat.jpg',
    }, {
      uid: -2,
      name: 'Картинка 2.png',
      status: 'done',
      url: 'https://img2.goodfon.ru/wallpaper/middle/7/f0/zhivopis-orlovskiy-vid-na.jpg',
    }, {
      uid: -3,
      name: 'Картинка 3.png',
      status: 'done',
      url: 'https://img2.goodfon.ru/wallpaper/middle/7/f0/zhivopis-orlovskiy-vid-na.jpg',
    }],
  },
};

export default Upload;
