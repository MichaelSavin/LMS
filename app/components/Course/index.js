import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Icon as AntIcon } from 'antd';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import localForage from 'localforage';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import * as actionCreators from './actions';
import courseSelector from './selectors';
import styles from './styles.css';
import Sidebar from './Sidebar';

class Course extends Component { // HMR

  constructor(props) {
    super(props);
    this.state = {
      exporting: false,
    };
  }

  importCourse = (files) => {
    const blob = files[0].slice(0);
    const reader = new FileReader();
    reader.onloadend = () => { // eslint-disable-line
      this.props
        .actions
        .importCourse({
          course: JSON.parse(
            reader.result
          ),
        });
      this.context // eslint-disable-line
        .router
        .push(this
          .props
          .location
          .pathname
        );
    };
    reader.readAsText(blob);
  }

  exportCourse = () => {
    this.setState({ exporting: true });
    const images = {};
    const zip = new JSZip();
    const state = JSON.stringify(this.props.data.toJS());
    localForage.iterate((value, key) => {
      const regex = new RegExp(key, 'g');
      if (!state.match(regex)) {
        localForage.removeItem(key);
      } else {
        images[key] = value; // eslint-disable-line
      }
    }).then(() => {
      Object.keys(images).forEach((image) => {
        zip.file(image, images[image]);
      });
      zip.file('Data', state);
      zip.generateAsync({ type: 'blob' })
        .then((content) => {
          FileSaver.saveAs(content, 'Курс.zip');
        }).then(() => {
          this.setState({ exporting: false });
        });
    });
  }

  render() {
    const {
      data,
      actions,
      location,
      children,
    } = this.props;
    const {
      exporting,
    } = this.state;
    return (
      <div className={styles.course}>
        <div className={styles.sidebar}>
          <Sidebar
            data={data}
            route={
              location
                .pathname
                .split('/')[1]
            }
            actions={actions}
          />
          <div className={styles.actions}>
            <span
              className={styles.export}
              onClick={exporting
                ? () => {}
                : this.exportCourse
              }
            >
              {exporting
                ? <AntIcon type="loading" />
                : <span>Экспорт курса</span>
              }
            </span>
            <Dropzone
              multiple={false}
              title="Upload state"
              onDrop={this.uploadCourse}
              className={styles.import}
            >
              Импорт курса
            </Dropzone>
          </div>
        </div>
        <div className={styles.content}>
          {children &&
            React.cloneElement(
              children, {
                // key: Math.random(),
                data: data.toJS(),
                actions,
              }
            )
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = courseSelector();

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

Course.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  children: PropTypes.element,
};

Course.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Course);
