import React, { Component, PropTypes } from 'react';
import { Collapse as AntCollapse } from 'antd';
import { isEqual } from 'lodash';
import styles from './styles.css';

class Collapse extends Component {

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
    return (
      <div className={styles.collapse}>
        <AntCollapse>
          <AntCollapse.Panel header="Блок 1" key="1">
            <p>Текст блока 1</p>
          </AntCollapse.Panel>
          <AntCollapse.Panel header="Блок 2" key="2">
            <p>Текст блока 2</p>
          </AntCollapse.Panel>
          <AntCollapse.Panel header="Блок 3" key="3">
            <p>Текст блока 3</p>
          </AntCollapse.Panel>
        </AntCollapse>
      </div>
    );
  }
}

Collapse.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    rows: PropTypes.object.isRequired,
  }).isRequired,
};

export default Collapse;
