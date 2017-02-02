import React, { PropTypes } from 'react';
import {
  Icon as AntIcon,
  Menu as AntMenu,
  Button as AntButton,
  Dropdown as AntDropdown,
} from 'antd';
import styles from './styles.css';

const tasks = [{
  section: 'Базовые',
  items: [
    { name: 'Слайдер', type: 'SLIDER' },
    { name: 'Ввод ответа', type: 'INPUT' },
    // { name: 'Перемещение', type: 'TRANSFER' },
    { name: 'Переключатель', type: 'SWITCH' },
    { name: 'Выбор из списка', type: 'SELECT' },
    { name: 'Развернутый ответ', type: 'TEXTAREA' },
    { name: 'Единственный выбор', type: 'RADIO' },
    { name: 'Множественный выбор', type: 'CHECKBOX' },
    { name: 'Сортировка', type: 'SORTER' },
    { name: 'Сопоставление', type: 'MATCHER' },
    { name: 'Загрузка файла', type: 'FILE' },
  ],
}, {
  section: 'Математические',
  items: [
    { name: 'Формула', type: 'TEX' },
  ],
}, {
  section: 'Другие',
  items: [],
}];

const Tasks = ({
  editorState,
  insertEntity,
  changeEditorState,
}) =>
  <div className={styles.tasks}>
    {tasks.map(({
      section,
      items,
    },
      sectionIndex
    ) =>
      <AntDropdown
        key={sectionIndex}
        trigger={['click']}
        overlay={
          <AntMenu
            onClick={({
              item,
            }) =>
              insertEntity(
                item.props.data,
                editorState,
                changeEditorState
              )
            }
          >
            {items.map(({
              name,
              type,
            },
              itemIndex
            ) =>
              <AntMenu.Item
                key={itemIndex}
                data={type}
              >
                {name}
              </AntMenu.Item>
            )}
          </AntMenu>
        }
      >
        <AntButton
          style={{
            marginRight: 10,
          }}
        >
          {section}
          <AntIcon type="down" />
        </AntButton>
      </AntDropdown>
    )}
    <span
      className={styles.hint}
      onClick={() =>
        insertEntity(
          'HINT',
          editorState,
          changeEditorState
        )
      }
    >
      Подсказка
    </span>
  </div>;

Tasks.propTypes = {
  editorState: PropTypes.object.isRequired,
  insertEntity: PropTypes.func.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Tasks;
