import React, { Component, PropTypes } from 'react';
import {
  Table as AntTable,
  Button,
} from 'antd';
import {
  set,
  random,
} from 'lodash/fp';

import {
  Entity,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import {
  entitiesDecorator,
} from '../../Entities';
import EditableCell from './Cell';
import styles from './styles.css';

const renderCell = ( // eslint-disable-line react/display-name
    value
  ) => (
  // console.log(text);
  // console.log(record);
  // console.log(index);

    <EditableCell value={value} isReadOnly />
  );


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
        newRow[key] = EditorState // eslint-disable-line fp/no-mutation
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
      render: renderCell,
    })),
  });

const convertDraftEditorStateToRow = (object) => ({
  ...object,
  dataSource: object.dataSource.map((row) => {
    const newRow = { ...row, editorKeys: [] };
    Object.keys(row).forEach((key) => {
      if (row[key] instanceof EditorState) {
        newRow.editorKeys.push(key); // eslint-disable-line fp/no-mutating-methods
        newRow[key] = convertToRaw( // eslint-disable-line fp/no-mutation
          row[key]
            .getCurrentContent()
        );
      }
    });
    return newRow;
  }),
  columns: object.columns.map((col) => ({
    ...col,
    editorStateTtle: convertToRaw(
      col.editorStateTtle
        .getCurrentContent()
    ),
  })),
});


class EditableTable extends Component {
  constructor(props) {
    console.log(props);
    super(props);
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

  editTable = (type, columnKey, index) => (e) => {
    console.log(e.target);
    switch (type) {
      case 'addRowUp':
        this.addRow(index);
        break;

      case 'addRowDown':
        this.addRow(index + 1);
        break;

      default:
        console.log(type);
        break;
    }
  }

  addRow = (index) => {
    const newDataSource = [...this.state.temp.dataSource];
    const newRow = Object.keys(newDataSource[index])
      .reduce((obj, key) => ({
        ...obj,
        [key]: '',
      }), {});
    newRow.key = `${random(0, 999)}`; // eslint-disable-line
    newDataSource.splice(index, 0, newRow); // eslint-disable-line
    this.setState({
      temp: set([
        'dataSource',
      ],
        newDataSource,
        this.state.temp,
      ),
    });
  }

  headChange = (columnKey) => (value) => {
    this.setState({
      temp: set([
        'columns',
        columnKey,
        'title',
      ],
        <EditableCell
          editTable={this.editTable}
          index={-1}
          value={value}
          onChange={this.headChange(columnKey)}
          columnKey={columnKey}
        />,
        set([
          'columns',
          columnKey,
          'editorStateTtle',
        ],
          value,
          this.state.temp,
        ),
      ),
    });
  };

  // onDelete = (index) => () => {
  //   const dataSource = [...this.state.temp.dataSource];
  //   dataSource.splice(index, 1);
  //   this.setState({ dataSource });
  // };

  // handleAdd = () => {
  //   const { count, dataSource } = this.state;
  //   const newData = {
  //     key: count,
  //     name: `Edward King ${count}`,
  //     age: 32,
  //     address: `London, Park Lane no. ${count}`,
  //   };
  //   this.setState({
  //     dataSource: [...dataSource, newData],
  //     count: count + 1,
  //   });
  // }

  changeTable = () => {
    const { content: {
      columns,
    }, content } = this.state;
    this.setState({
      temp: {
        ...content,
        columns: columns.map((obj, key) => ({
          ...obj,
          title: (<EditableCell
            index={-1}
            value={obj.editorStateTtle}
            onChange={this.headChange(key)}
            columnKey={key}
            editTable={this.editTable}
          />),
          render: (text, record, index) => (
            <EditableCell
              editTable={this.editTable}
              index={index}
              value={text}
              onChange={this.onCellChange(index, obj.dataIndex)}
              columnKey={key}
            />
          ),
        })),
      },
    }, this.context.toggleReadOnly);
  }

  saveSettings = () => {
    const {
      temp: { columns },
      temp,
    } =
      this.state;
    this.setState({
      modal: false,
      content: temp,
      temp: {
        ...temp,
        columns: columns.map((obj) => ({
          ...obj,
          title: (<EditableCell
            value={obj.editorStateTtle}
            isReadOnly
          />),
          render: (value) => (
            <EditableCell
              value={value}
              isReadOnly
            />
          ),
        })),
      },
    });
    Entity.mergeData(
      this.props.entityKey, {
        content: convertDraftEditorStateToRow(temp),
      }
    );
    this.context.toggleReadOnly();
  }

  render() {
    const { dataSource, columns } = this.state.temp || this.state.content;
    return (<div className={styles.table}>
      <Button className="editable-add-btn" type="ghost" onClick={this.changeTable}>Редактировать</Button>
      <Button className="editable-add-btn" type="ghost" onClick={this.saveSettings}>Сохранить</Button>
      <Button className="editable-add-btn" type="ghost" onClick={this.handleAdd}>Add</Button>
      <AntTable bordered dataSource={dataSource} columns={columns} className={styles.table} />
    </div>);
  }
}

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
    }, {
      title: 'Age',
      dataIndex: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
    }],
    dataSource: [{
      key: '0',
      name: 'Edward King 0',
      age: '31',
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
