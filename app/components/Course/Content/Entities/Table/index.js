import React, { Component, PropTypes } from 'react';
import {
  Table as AntTable,
  Button as AntButton,
} from 'antd';
import {
  get,
  set,
  omit,
  random,
} from 'lodash/fp';
import {
  Entity,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import classNames from 'classnames';
import {
  entitiesDecorator,
} from '../../Entities';
import Cell from './Cell';
import Editor from './Editor';
import styles from './styles.css';

const toggleColumnFixedWidth = (isEqual, content) => {
  const { columns } = content;
  return {
    ...content,
    styles: set([
      'equalColumnsWidth',
    ],
      isEqual,
      content.styles,
    ),
    columns: columns.map((column) => ({
      ...column,
      width: isEqual
        ? `${100 / columns.length}%`
        : null,
    })),
  };
};

const convertRawToDraftEditorState = (object) =>
  object && ({
    ...object,
    dataSource: object.dataSource.map((row) => (
      Object.keys(row).reduce((newRow, key) => (
        key === 'key' ? newRow : {
          ...newRow,
          [key]: EditorState
            .createWithContent(
            convertFromRaw(row[key]),
            entitiesDecorator
          ),
        }
      ), row)
    )),
    columns: object.columns.map((column) => ({
      ...column,
      titleData: EditorState
        .createWithContent(
          convertFromRaw(column.titleData),
          entitiesDecorator
        ),
      title: (<Cell
        value={
          EditorState
            .createWithContent(
              convertFromRaw(column.titleData),
              entitiesDecorator
            )
        }
        isReadOnly
      />),
      render(value) {
        return <Cell value={value} isReadOnly />;
      },
    })),
  });

const convertDraftEditorStateToRow = (object) => ({
  ...object,
  dataSource: object.dataSource.map((row) => (
    Object.keys(row).reduce((newRow, key) => (
      row[key] instanceof EditorState ? {
        ...newRow,
        [key]: convertToRaw(
          row[key]
            .getCurrentContent()
        ),
      } : newRow
    ), { ...row })
  )),
  columns: object.columns.map((column) => ({
    ...column,
    title: null,
    render: null,
    titleData: convertToRaw(
      column.titleData
        .getCurrentContent()
    ),
  })),
});


class Table extends Component {
  constructor(props) {
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

  addColumn = (columnKey) => {
    const dataIndex = `index${random(0, 999)}`;
    const { temp } = this.state;
    const dataSource = temp.dataSource
      .map((row) => ({
        ...row,
        [dataIndex]: EditorState.createEmpty(),
      }));
    const columns = [
      ...temp.columns.slice(0, columnKey),
      {
        titleData: EditorState.createEmpty(),
        dataIndex,
      },
      ...temp.columns.slice(columnKey),
    ];
    this.setState({
      temp: toggleColumnFixedWidth(
        temp.styles.equalColumnsWidth,
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
      temp: toggleColumnFixedWidth(
        temp.styles.equalColumnsWidth,
        {
          ...temp,
          dataSource: dataSource
            .map((row) => omit(dataIndex, row)),
          columns: this.makeEditableColumns(
            columns.filter((value, key) => key !== columnKey)
          ),
        }
      ),
    });
  }

  addRow = (columnKey, index) => {
    const newDataSource = [...this.state.temp.dataSource];
    const newRow = Object.keys(newDataSource[0])
      .reduce((row, key) => (
        key === 'key' ? row : {
          ...row,
          [key]: EditorState.createEmpty(),
        }), { ...newDataSource[0], key: `${random(0, 999)}` });
    this.setState({
      temp: set([
        'dataSource',
      ],
        [
          ...newDataSource.slice(0, index),
          newRow,
          ...newDataSource.slice(index),
        ],
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
          dataSource.filter((value, key) => key !== index),
          this.state.temp,
        ),
      });
    }
  }

  headChange = (columnKey) => (titleData) => {
    const { temp } = this.state;
    this.setState({
      temp: set([
        'columns',
        columnKey,
      ],
        {
          ...temp.columns[columnKey],
          // https://ant.design/components/table/#Column
          // Ант таблица может рендерить кастомный React.Elment
          // который передаеться ей через свойство title
          // к сожалению при изменении данных надо передавать
          // весь элемент с новыми пропсами
          title: <Cell
            addRow={this.addRow}
            delRow={this.delRow}
            addColumn={this.addColumn}
            delColumn={this.delColumn}
            index={-1}
            value={titleData}
            onChange={this.headChange(columnKey)}
            columnKey={columnKey}
          />,
          titleData,
        },
        temp,
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
      columns: columns.map((column) => ({
        ...column,
        title: (<Cell
          value={column.titleData}
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

  makeEditableColumns = (columns) => columns
    .map((column, key) => ({
      ...column,
      title: (
      // Это свойство содержить компонет для рендера ячейки заголовков таблицы
      // https://ant.design/components/table/#Column
        <Cell
          index={-1}
          value={column.titleData}
          onChange={this.headChange(key)}
          columnKey={key}
          addRow={this.addRow}
          delRow={this.delRow}
          addColumn={this.addColumn}
          delColumn={this.delColumn}
        />),
      render: (text, record, index) => (
      // Функция для рендера ячейки
      // https://ant.design/components/table/#Column
        <Cell
          addRow={this.addRow}
          delRow={this.delRow}
          addColumn={this.addColumn}
          delColumn={this.delColumn}
          index={index}
          value={text}
          onChange={this.onCellChange(index, column.dataIndex)}
          columnKey={key}
        />
      ),
    }))

  editorOnChange = (type) => (event) => {
    // Если событие произошло в Ant.Select
    // то в параметре функции передается
    // значение select а не event!
    const value = !event.target && event;
    const { temp } = this.state;
    if (value) {
      this.setState({
        temp: set([
          'styles',
          type,
        ],
          value,
          this.state.temp,
        ),
      });
    } else if (type === 'equalColumnsWidth') {
      this.setState({
        temp: toggleColumnFixedWidth(
          event.target.checked, temp
        ),
      });
    } else {
      this.setState({
        temp: set([
          'styles',
          type,
        ],
          event.target.checked,
          this.state.temp,
        ),
      });
    }
  }

  deleteBlock = () => this.context.removeBlock(this.props.blockKey);

  render() {
    const content = this.state.temp || this.state.content;
    const { dataSource, columns } = content;
    const { isReadOnly } = this.state;
    return (<div
      className={classNames(
        styles.table,
        styles[content.styles.head],
        styles[content.styles.body],
        {
          [styles.editing]: !isReadOnly,
        },
      )}
      onDoubleClick={isReadOnly && this.editMode}
    >
      <AntTable
        columns={columns}
        pagination={false}
        dataSource={dataSource}
        showHeader={!content.styles.hideHeader}
        bordered={get(['body'], content.styles) === 'big'}
      />
      {isReadOnly ?
        <div className={styles.actions}>
          <AntButton
            type="danger"
            icon="close-circle"
            className={styles.icon}
            onClick={this.deleteBlock}
          />
          <AntButton
            icon="edit"
            type="primary"
            className={styles.icon}
            onClick={this.editMode}
          />
        </div>
        : <div className={styles.editor}>
          <Editor
            styles={content.styles}
            onChange={this.editorOnChange}
            closeEditor={this.closeEditor}
            saveSettings={this.saveSettings}
          />
          <div className={styles.actions}>
            <AntButton
              type="primary"
              icon="rollback"
              className={styles.icon}
              onClick={this.closeEditor}
            />
            <AntButton
              type="primary"
              icon="check-circle"
              className={styles.icon}
              onClick={this.saveSettings}
            />
          </div>
        </div>
      }
    </div>);
  }
}

Table.propTypes = {
  blockKey: PropTypes.string.isRequired,
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    styles: PropTypes.shape({
      hideHeader: PropTypes.bool,
      equalColumnsWidth: PropTypes.bool,
      head: PropTypes.oneOf([
        'bold',
        'normal',
      ]).isRequired,
      body: PropTypes.oneOf([
        'big',
        'small',
        'compact',
      ]).isRequired,
    }).isRequired,
    /* https://ant.design/components/table/#How-To-Use */
    data: PropTypes.shape({
      rows: PropTypes.arrayOf( // dataSource
        PropTypes.objectOf(
          PropTypes.instanceOf(EditorState),
        ).isRequired,
      ).isRequired,
      /* https://ant.design/components/table/#Column */
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.element,
          width: PropTypes.string, // Ширина в процентах "20%"
          render: PropTypes.func,
          content: PropTypes.oneOfType([
            PropTypes.instanceOf(EditorState),
            /* https://facebook.github.io/draft-js/docs/api-reference-data-conversion.html#converttoraw */
            PropTypes.shape({
              blocks: PropTypes.arrayOf(PropTypes.object.isRequired),
              entityMap: PropTypes.object.isRequired,
            }).isRequired,
          ]).isRequired,
          dataIndex: PropTypes.string.isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

// // Новая структура данных компонента

// Table.propTypes = {
//   entityKey: PropTypes.string.isRequired,
//   blockKey: PropTypes.string.isRequired,
//   content: PropTypes.shape({
//     styles: PropTypes.shape({
//       table: PropTypes.shape({
//         head: PropTypes.oneOf([
//           'bold',
//           'normal',
//         ]).isRequired,
//         body: PropTypes.oneOf([
//           'big',
//           'small',
//           'compact',
//         ]).isRequired,
//       }).isRequired,
//     }).isRequired,
//     /* https://ant.design/components/table/#How-To-Use */
//     data: PropTypes.shape({
//       rows: PropTypes.arrayOf( // dataSource
//         PropTypes.objectOf(
//           PropTypes.instanceOf(EditorState),
//         ).isRequired,
//       ).isRequired,
//       /* https://ant.design/components/table/#Column */
//       columns: PropTypes.arrayOf(
//         PropTypes.shape({
//           title: PropTypes.element,
//           width: PropTypes.number,
//           render: PropTypes.func,
//           content: PropTypes.oneOfType([
//             PropTypes.instanceOf(EditorState),
//             /* https://facebook.github.io/draft-js/docs/api-reference-data-conversion.html#converttoraw */
//             PropTypes.shape({
//               blocks: PropTypes.arrayOf(PropTypes.object.isRequired),
//               entityMap: PropTypes.object.isRequired,
//             }).isRequired,
//           ]).isRequired,
//           dataIndex: PropTypes.string.isRequired,
//         }).isRequired,
//       ).isRequired,
//     }).isRequired,
//   }).isRequired,
// };

const emptyEditorStateRaw = convertToRaw(
  EditorState.createEmpty()
    .getCurrentContent()
);

Table.defaultProps = {
  content: {
    styles: {
      body: 'big',
      head: 'bold',
    },
    columns: [{
      titleData: emptyEditorStateRaw,
      dataIndex: 'name',
    }, {
      titleData: emptyEditorStateRaw,
      dataIndex: 'age',
    }, {
      titleData: emptyEditorStateRaw,
      dataIndex: 'address',
    }],
    dataSource: [{
      key: '0',
      name: emptyEditorStateRaw,
      age: emptyEditorStateRaw,
      address: emptyEditorStateRaw,
    }, {
      key: '1',
      name: emptyEditorStateRaw,
      age: emptyEditorStateRaw,
      address: emptyEditorStateRaw,
    }],
  },
};

Table.contextTypes = {
  toggleReadOnly: PropTypes.func,
  removeBlock: PropTypes.func,
};

export default Table;
