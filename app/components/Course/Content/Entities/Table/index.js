import React, { Component, PropTypes } from 'react';
import {
  Table as AntTable,
  Input,
  Icon, Button, Popconfirm } from 'antd';

// import { isEqual } from 'lodash';
import { Input as DraftInput } from '../../Editor';
// import styles from './styles.css';

// class Table extends Component {

//   constructor(props) {
//     super(props);
//     this.state = props.content;
//   }

//   shouldComponentUpdate(
//     nextProps,
//     nextState
//   ) {
//     return !isEqual(
//       this.state,
//       nextState
//     );
//   }

//   render() {
//     const {
//       content: {
//         data,
//         columns,
//       },
//     } = this.props;
//     return (
//       <div>
//         <AntTable
//           columns={columns}
//           dataSource={data}
//           size="small"
//         />
//       </div>
//     );
//   }
// }

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (<div className="editable-cell">
      {
        editable ?
          <div className="editable-cell-input-wrapper">
            <Input
              value={value}
              onChange={this.handleChange}
              onPressEnter={this.check}
            />
            <Icon
              type="check"
              className="editable-cell-icon-check"
              onClick={this.check}
            />
          </div>
          :
          <div className="editable-cell-text-wrapper">
            {value || ' '}
            <Icon
              type="edit"
              className="editable-cell-icon"
              onClick={this.edit}
            />
          </div>
      }
    </div>);
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: 'name',
      dataIndex: 'name',
      width: '30%',
      render: (text, record, index) => (
        <EditableCell
          value={text}
          onChange={this.onCellChange(index, 'name')}
          />
      ),
    }, {
      title: 'age',
      dataIndex: 'age',
    }, {
      title: 'address',
      dataIndex: 'address',
    }, {
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record, index) => {
        return (
          this.state.dataSource.length > 1 ?
            (
              <Popconfirm title="Sure to delete?" onConfirm={this.onDelete(index)}>
                <a href="#">Delete</a>
              </Popconfirm>
            ) : null
        );
      },
    }];

    this.state = {
      dataSource: [{
        key: '0',
        name: 'Edward King 0',
        age: '32',
        address: 'London, Park Lane no. 0',
      }, {
        key: '1',
        name: 'Edward King 1',
        age: '32',
        address: 'London, Park Lane no. 1',
      }],
      count: 2,
    };
  }
  onCellChange = (index, key) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      this.setState({ dataSource });
    };
  }
  onDelete = (index) => {
    return () => {
      const dataSource = [...this.state.dataSource];
      dataSource.splice(index, 1);
      this.setState({ dataSource });
    };
  }
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (<div>
      <Button className="editable-add-btn" type="ghost" onClick={this.handleAdd}>Add</Button>
      <AntTable bordered dataSource={dataSource} columns={columns} />
    </div>);
  }
}

// const Comp = ({ text }) => (<h1>{text}</h1>)

// Table.propTypes = {
//   entityKey: PropTypes.string.isRequired,
//   content: PropTypes.shape({
//     data: PropTypes.array.isRequired,
//     columns: PropTypes.array.isRequired,
//   }).isRequired,
// };

// Table.defaultProps = {
//   content: {
//     columns: [{
//       title: <Comp text="Пётр I Алексеевич" />,
//       dataIndex: 'name',
//     }, {
//       title: 'Годы жизни',
//       dataIndex: 'years',
//     }, {
//       title: 'Годы правления',
//       dataIndex: 'reign',
//     }],
//     data: [{
//       key: '1',
//       name: <Comp text="Пётр I Алексеевич" />,
//       years: '1672 — 1725',
//       reign: '1689 — 1725',
//     }, {
//       key: '2',
//       name: 'Александр III Александрович',
//       years: '1845 — 1894',
//       reign: '1881 — 1894',
//     }, {
//       key: '3',
//       name: 'Николай II Александрович',
//       years: '1868 — 1918',
//       reign: '1894 — 1917',
//     }],
//   },
// };

export default EditableTable;
