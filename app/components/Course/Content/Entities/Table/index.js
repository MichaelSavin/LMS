import React, { Component, PropTypes } from 'react';
import {
  Table as AntTable,
  Button,
} from 'antd';
import {
  set,
} from 'lodash/fp';

import {
  Entity,
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import {
  entitiesDecorator,
} from '../../Entities';

// import { isEqual } from 'lodash';
import EditableCell from './Cell';

const convertRawOrEmptyState = (raw) => (
  raw
  ? EditorState
    .createWithContent(
      convertFromRaw(raw),
      entitiesDecorator
    )
  : EditorState.createEmpty()
);

const convertRawToDraftEditorState = (object) =>
  object && ({
    ...object,
    dataSource: object.dataSource.map((row) => {
      const newRow = { ...row };
      (row.editorKeys || []).forEach((key) => {
        newRow[key] = EditorState
          .createWithContent(
            convertFromRaw(row[key]),
            entitiesDecorator
        );
      });
      return newRow;
    }),
    columns: object.columns.map((obj) => ({
      ...obj,
      editorStateTtle: convertRawOrEmptyState(obj.editorStateTtle),
      title: (<EditableCell
        value={convertRawOrEmptyState(obj.editorStateTtle)}
        isReadOnly
      />),
      render: (text) => (
        <EditableCell value={text} isReadOnly />
      ),
    })),
  });

const convertDraftEditorStateToRow = (object) => ({
  ...object,
  dataSource: object.dataSource.map((row) => {
    const newRow = { ...row, editorKeys: [] };
    Object.keys(row).forEach((key) => {
      if (row[key] instanceof EditorState) {
        newRow.editorKeys.push(key);
        newRow[key] = convertToRaw(
          row[key]
            .getCurrentContent()
        );
      }
    });
    return newRow;
  }),
  columns: object.columns.map((col) => (
    {
      ...col,
      editorStateTtle: convertToRaw(
        col.editorStateTtle
          .getCurrentContent()
      ),
    }
  )
  // {
  //   const newCol = { ...col, editorKeys: [] };
  //   Object.keys(col).forEach((key) => {
  //     if (col[key] instanceof EditorState) {
  //       newCol.editorKeys.push(key);
  //       newCol[key] = convertToRaw(
  //         col[key]
  //           .getCurrentContent()
  //       );
  //     }
  //   });
  //   return newRow;
  // }
  ),
});


class EditableTable extends Component {
  constructor(props) {
    console.log(props);
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
      content: convertRawToDraftEditorState(this.props.content),
      temp: false,
    };
  }

  onCellChange = (index, key) => (value) => {
    this.setState({
      temp: set([
        'dataSource',
        index,
        key,
      ],
        value,
        this.state.temp,
      ),
    });
  };

  onHeadChange = (key) => (value) => {
    this.setState({
      temp: set([
        'columns',
        key,
        'title',
      ],
        <EditableCell
          value={value}
          onChange={this.onHeadChange(key)}
        />,
        set([
          'columns',
          key,
          'editorStateTtle',
        ],
          value,
          this.state.temp,
        ),
      ),
    });
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
        columns: columns.map((obj, key) => ({
          ...obj,
          title: (<EditableCell
            value={obj.editorStateTtle}
            onChange={this.onHeadChange(key)}
          />),
          render: (text, record, index) => (
            <EditableCell
              value={text}
              onChange={this.onCellChange(index, obj.dataIndex)}
            />
          ),
        })),
      },
    }, () => {
      console.log(this.state);
      this.context.toggleReadOnly();
    });
  }

  saveSettings = () => {
    const content =
      this.state.temp;
    this.setState({
      modal: false,
      content,
    });
    Entity.mergeData(
      this.props.entityKey, {
        content: convertDraftEditorStateToRow(content),
      }
    );
    this.context.toggleReadOnly();
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
