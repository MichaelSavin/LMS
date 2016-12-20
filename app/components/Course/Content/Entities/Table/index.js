import React, { Component, PropTypes } from 'react';
import {
  Table as AntTable,
  Button,
} from 'antd';

import {
  Entity,
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';

// import { isEqual } from 'lodash';
import EditableCell from './Cell';

const createDraftEditorStateFromText = (text) =>
  EditorState.createWithContent(
    ContentState.createFromText(text),
    entitiesDecorator,
  );

const convertTextToDraftEditorState = (object, key) =>
  object && ({
    [key]: object[key].map((row) => ({
      ...row,
      content: EditorState
        .createWithContent(
        convertFromRaw(row.content),
        entitiesDecorator,
      ),
    })),
  });

const convertDraftEditorStateToText = (object, key) => ({
  [key]: object[key].map((row) => ({
    ...row,
    content: convertToRaw(
      row.content
        .getCurrentContent()
    ),
  })),
});


class EditableTable extends Component {
  constructor(props) {
    super(props);
    // this.columns = [{
    //   title: 'name',
    //   dataIndex: 'name',
    //   width: '40%',
    //   render: (text, record, index) => (
    //     <EditableCell
    //       value={text}
    //       onChange={this.onCellChange(index, 'name')}
    //     />
    //   ),
    // }, {
    //   title: 'age',
    //   dataIndex: 'age',
    // }, {
    //   title: 'address',
    //   dataIndex: 'address',
    // }, {
    //   title: 'operation',
    //   dataIndex: 'operation',
    //   render: (text, record, index) => {
    //     return (
    //       this.state.dataSource.length > 1 ?
    //         (
    //           <Popconfirm title="Sure to delete?" onConfirm={this.onDelete(index)}>
    //             <a href="#">Delete</a>
    //           </Popconfirm>
    //         ) : null
    //     );
    //   },
    // }];

    this.state = {
      isReadOnly: true,
      content: this.props.content,
      temp: false,
    };
  }

  onCellChange = (index, key) => {
    return (value) => {
      const dataSource = [...this.state.temp.dataSource];
      dataSource[index][key] = value;
      this.setState({ dataSource });
    };
  };

  onDelete = (index) => {
    return () => {
      const dataSource = [...this.state.temp.dataSource];
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

  editTable = () => {
    const { content: {
      columns,
    }, content } = this.state;
    this.setState({
      temp: {
        ...content,
        columns: columns.map((obj) => ({
          ...obj,
          render: (text, record, index) => (
            <EditableCell
              value={text}
              onChange={this.onCellChange(index, obj.dataIndex)}
            />
          ),
        })),
      },
    }, this.context.toggleReadOnly);
  }

  saveSettings = () => {
    const content =
      this.state.temp;
    this.setState({
      modal: false,
      content,
    });
    Entity.replaceData(
      this.props.entityKey, {
        content: convertDraftEditorStateToText(
          content,
          'tags'
        ),
      }
    );
  }

  render() {
    const { dataSource, columns } = this.state.temp || this.state.content;
    return (<div>
      <Button className="editable-add-btn" type="ghost" onClick={this.editTable}>Редактировать</Button>
      <Button className="editable-add-btn" type="ghost" onClick={this.saveSettings}>Сохранить</Button>
      <Button className="editable-add-btn" type="ghost" onClick={this.handleAdd}>Add</Button>
      <AntTable bordered dataSource={dataSource} columns={columns} />
    </div>);
  }
}

// const Comp = ({ text }) => (<h1>{text}</h1>)

EditableTable.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    dataSource: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
  }).isRequired,
};

EditableTable.defaultProps = {
  content: {
    columns: [{
      title: 'Name',
      dataIndex: 'name',
      width: '40%',
      render: (text) => (
        <EditableCell value={text} isReadOnly />
      ),
    }, {
      title: 'Age',
      dataIndex: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
    }, /*{
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
    }*/],
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
  },
};

EditableTable.contextTypes = {
  toggleReadOnly: PropTypes.func,
};

export default EditableTable;
