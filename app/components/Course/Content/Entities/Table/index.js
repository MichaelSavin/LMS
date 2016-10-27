import React, { Component, PropTypes } from 'react';
import { Table as AntTable } from 'antd';
import { isEqual } from 'lodash';
// import styles from './styles.css';

class Table extends Component {

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
      content: {
        data,
        columns,
      },
    } = this.props;
    return (
      <div>
        <AntTable
          columns={columns}
          dataSource={data}
          size="small"
        />
      </div>
    );
  }
}

Table.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
  }).isRequired,
};

Table.defaultProps = {
  content: {
    columns: [{
      title: 'Имератор',
      dataIndex: 'name',
    }, {
      title: 'Годы жизни',
      dataIndex: 'years',
    }, {
      title: 'Годы правления',
      dataIndex: 'reign',
    }],
    data: [{
      key: '1',
      name: 'Пётр I Алексеевич',
      years: '1672 — 1725',
      reign: '1689 — 1725',
    }, {
      key: '2',
      name: 'Александр III Александрович',
      years: '1845 — 1894',
      reign: '1881 — 1894',
    }, {
      key: '3',
      name: 'Николай II Александрович',
      years: '1868 — 1918',
      reign: '1894 — 1917',
    }],
  },
};

export default Table;
