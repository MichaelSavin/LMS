import React, { Component, PropTypes } from 'react';
import { Table as AntTable } from 'antd';
import { isEqual } from 'lodash';
// import styles from './styles.css';

const columns = [{
  title: 'Имя',
  dataIndex: 'name',
}, {
  title: 'Возраст',
  dataIndex: 'age',
}, {
  title: 'Адрес',
  dataIndex: 'address',
}];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];

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
    rows: PropTypes.object.isRequired,
  }).isRequired,
};

export default Table;
