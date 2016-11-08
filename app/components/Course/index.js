import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import * as actionCreators from './actions';
import courseSelector from './selectors';
import styles from './styles.css';
import Sidebar from './Sidebar';

class Course extends Component { // HMR

  uploadCourse = (files) => {
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
    };
    reader.readAsText(blob);
  }

  render() {
    const {
      data,
      actions,
      location,
      children,
    } = this.props;
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
            <a
              href={`data:application/json;charset=utf-8,${
                encodeURIComponent(
                  JSON.stringify(
                    data.toJS()
                  )
                )
              }`}
              className={styles.export}
              download="Курс.json"
            >
              Экспорт курса
            </a>
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

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

Course.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  children: PropTypes.element,
};

export default connect(mapStateToProps, mapDispatchToProps)(Course);
