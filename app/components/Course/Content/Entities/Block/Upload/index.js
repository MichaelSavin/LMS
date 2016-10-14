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

export default Upload;
