import React, { Component, PropTypes } from 'react';
import {
  Table as AntTable,
  Button as AntButton,
} from 'antd';
import {
  set,
  random,
  omit,
  get,
} from 'lodash/fp';
import classNames from 'classnames';
import {
  Entity,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import {
  entitiesDecorator,
} from '../../Entities';
import Cell from './Cell';
import Editor from './Editor';
import styles from './styles.css';


const equalColumnWidthTrigger = (isEqual, temp) => {
  const { columns } = temp;
  return {
    ...temp,
    tableStyles: set([
      'equalColumnsWidth',
    ],
      isEqual,
      temp.tableStyles,
    ),
    columns: columns.map((obj) => ({
      ...obj,
      width: isEqual ? `${100 / columns.length}%` : null,
    })),
  };
};

const renderCell = (value) => (
  <Cell value={value} isReadOnly />
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
      console.log(row);
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
      title: (<Cell
        value={convertRawOrEmptyState(obj.editorStateTtle)}
        isReadOnly
      />),
      render: renderCell,
    })),
  });

const convertDraftEditorStateToRow = (object) => ({
  ...object,
  dataSource: object.dataSource.map((row) => {
    console.log(row);
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


class Table extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      content: convertRawToDraftEditorState(this.props.content),
      isReadOnly: true,
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
  }

  editTable = (type, columnKey, index) => () => {
    console.log(index);
    this[type](columnKey, index);
    // switch (type) {
    //   case 'addRowUp':
    //     this.addRow(index);
    //     break;

    //   case 'addRowDown':
    //     this.addRow(index + 1);
    //     break;

    //   default:
    //     console.log(type);
    //     break;
    // }
  }

  addColumn = (columnKey) => {
    const dataIndex = `index${random(0, 999)}`;
    const { temp } = this.state;
    const dataSource = temp.dataSource
      .map((obj) => ({
        ...obj,
        [dataIndex]: EditorState.createEmpty(),
      }));
    const columns = [...temp.columns];
    const newCol = {
      editorStateTtle: EditorState.createEmpty(),
      dataIndex,
    };
    columns.splice(columnKey, 0, newCol); // eslint-disable-line
    this.setState({
      temp: equalColumnWidthTrigger(
        temp.tableStyles.equalColumnsWidth,
        {
          ...temp,
          columns: this.makeEditableColumns(columns),
          dataSource,
        }
      ),
    });
  }

  delColumn = (columnKey) => {
    const {
      temp: {
        columns,
        dataSource,
      },
      temp,
    } = this.state;
    const { dataIndex } = columns[columnKey];
    this.setState({
      temp: equalColumnWidthTrigger(
        temp.tableStyles.equalColumnsWidth,
        {
          ...temp,
          dataSource: dataSource
            .map((obj) => omit(dataIndex, obj)),
          columns: this.makeEditableColumns(
            columns.filter((val, key) => key !== columnKey)
          ),
        }
      ),
    });
  }

  addRow = (columnKey, index) => {
    const newDataSource = [...this.state.temp.dataSource];
    const newRow = Object.keys(newDataSource[0])
      .reduce((obj, key) => ({
        ...obj,
        [key]: key === 'editorKeys'
        ? newDataSource[0].editorKeys
        : EditorState.createEmpty(),
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

  delRow = (columnKey, index) => {
    const { dataSource } = this.state.temp;
    if (dataSource.length > 1) {
      this.setState({
        temp: set([
          'dataSource',
        ],
          dataSource.filter((val, key) => key !== index),
          this.state.temp,
        ),
      });
    }
  }

  headChange = (columnKey) => (value) => {
    this.setState({
      temp: set([
        'columns',
        columnKey,
        'title',
      ],
        <Cell
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

  editMode = () => {
    const { content: {
      columns,
    }, content } = this.state;
    this.setState({
      isReadOnly: false,
      temp: {
        ...content,
        columns: this.makeEditableColumns(columns),
      },
    }, this.context.toggleReadOnly);
  }

  saveSettings = () => {
    const {
      temp: { columns },
      temp,
    } =
      this.state;
    const content = {
      ...temp,
      columns: columns.map((obj) => ({
        ...obj,
        title: (<Cell
          value={obj.editorStateTtle}
          isReadOnly
        />),
        render: (value) => (
          <Cell
            value={value}
            isReadOnly
          />
        ),
      })),
    };
    Entity.mergeData(
      this.props.entityKey, {
        content: convertDraftEditorStateToRow(temp),
      }
    );
    this.setState({
      content,
      temp: false,
      isReadOnly: true,
    });
    this.context.toggleReadOnly();
  }

  closeEditor = () => {
    this.setState({
      temp: false,
      isReadOnly: true,
    });
    this.context.toggleReadOnly();
  }

  makeEditableColumns = (columns) => columns.map((obj, key) => ({
    ...obj,
    title: (<Cell
      index={-1}
      value={obj.editorStateTtle}
      onChange={this.headChange(key)}
      columnKey={key}
      editTable={this.editTable}
    />),
    render: (text, record, index) => (
      <Cell
        editTable={this.editTable}
        index={index}
        value={text}
        onChange={this.onCellChange(index, obj.dataIndex)}
        columnKey={key}
      />
    ),
  }))

  editorOnChange = (type) => (e) => {
    const { temp } = this.state;
    if (type === 'equalColumnsWidth') {
      this.setState({
        temp: equalColumnWidthTrigger(e.target.checked, temp),
      });
    } else if (!e.target) {
      this.setState({
        temp: set([
          'tableStyles',
          type,
        ],
          { [e]: true },
          this.state.temp,
        ),
      });
    } else {
      this.setState({
        temp: set([
          'tableStyles',
          type,
        ],
          e.target.checked,
          this.state.temp,
        ),
      });
    }
  }

  render() {
    const { dataSource, columns, tableStyles } = this.state.temp || this.state.content;
    console.log(dataSource);
    const { isReadOnly } = this.state;
    return (<div
      className={classNames(
        styles.table, {
          [styles.editing]: !isReadOnly,
          ...tableStyles.headOptions,
          ...tableStyles.tableOptions,
        }
      )}
      onDoubleClick={isReadOnly && this.editMode}
    >
      <AntTable
        bordered={get(['tableOptions', 'table__big'], tableStyles)}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        showHeader={!tableStyles.hideHeader}
      />
      {!isReadOnly ?
        <div className={styles.editor}>
          <Editor
            saveSettings={this.saveSettings}
            closeEditor={this.closeEditor}
            onChange={this.editorOnChange}
            tableStyles={tableStyles}
          />
          <AntButton
            type="primary"
            icon="check-circle"
            className={styles.edit}
            onClick={this.saveSettings}
          />
        </div> :
        <AntButton
          type="primary"
          icon="edit"
          className={styles.edit}
          onClick={this.editMode}
        />
      }
    </div>);
  }
}

Table.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    dataSource: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
  }).isRequired,
};

Table.defaultProps = {
  content: {
    tableStyles: {
      tableOptions: {
        table__big: true,
      },
      headOptions: {
        'table-head__bold': true,
      },
    },
    columns: [{
      title: 'Name',
      dataIndex: 'name',
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
  },
};

Table.contextTypes = {
  toggleReadOnly: PropTypes.func,
};

export default Table;
