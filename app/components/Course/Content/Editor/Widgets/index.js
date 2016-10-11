import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Menu as AntMenu,
  Button as AntButton,
  Dropdown as AntDropdown,
} from 'antd';
import { insertEntity } from '../../Entities';

import styles from './styles.css';

const menu = [
  {
    name: 'Медиа',
    icon: 'picture',
    items: [
      {
        name: 'Файл',
      },
      {
        name: 'Аудио',
      },
      {
        name: 'Видео', // Video
      },
      {
        name: 'Изображение', // Image
      },
    ],
  },
  {
    name: 'Виджеты',
    icon: 'appstore-o',
    items: [
      {
        name: 'Тэг',
      },
      {
        name: 'Оценка',
        data: {
          view: 'INLINE',
          type: 'RATE',
        },
      },
      {
        name: 'Таблица',
      },
      {
        name: 'Слайдер',
      },
      {
        name: 'Формула',
        data: {
          view: 'INLINE',
          type: 'TEX',
          content: {
            value: 'a^n+b^n = c^n',
          },
        },
      },
      {
        name: 'Карточка',
      },
      {
        name: 'Прогресс',
      },
      {
        name: 'Развернуть',
      },
      {
        name: 'Шкала времени',
      },
      {
        name: 'Обратите внимание',
      },
    ],
  },
  {
    name: 'Задания',
    icon: 'book',
    items: [
      {
        name: 'Базовые',
        items: [
          {
            name: 'Ввод ответа',
            data: {
              view: 'INLINE',
              type: 'INPUT',
              content: {
                value: 'Правильный ответ',
              },
            },
          },
          {
            name: 'Голосование',
          },
          {
            name: 'Загрузка файла',
          },
          {
            name: 'Перетаскивание',
          },
          {
            name: 'Выбор из списка',
            data: {
              view: 'INLINE',
              type: 'SELECT',
              content: {
                answer: undefined,
                options: [
                  'Вариант 1',
                  'Вариант 2',
                  'Вариант 3',
                  'Вариант 4',
                ],
              },
            },
          },
          {
            name: 'Укажи на картинке',
          },
          {
            name: 'Развернутый ответ',
            data: {
              view: 'BLOCK',
              type: 'TEXTAREA',
              content: {
                value: 'Развернутый ответ',
              },
            },
          },
          {
            name: 'Единственный выбор',
            data: {
              view: 'BLOCK',
              type: 'RADIO',
              content: {
                answer: undefined,
                options: [
                  'Вариант 1',
                  'Вариант 2',
                  'Вариант 3',
                  'Вариант 4',
                ],
              },
            },
          },
          {
            name: 'Множественный выбор',
            data: {
              view: 'BLOCK',
              type: 'CHECKBOX',
              content: {
                answers: [],
                options: [
                  'Вариант 1',
                  'Вариант 2',
                  'Вариант 3',
                  'Вариант 4',
                ],
              },
            },
          },
        ],
      },
      {
        name: 'Математические',
        items: [
          {
            name: 'График',
          },
          {
            name: 'Матрица',
          },
          {
            name: 'Слайдер',
          },
          {
            name: 'Измерение',
          },
          {
            name: 'Рисование',
          },
          {
            name: 'Сопоставление',
          },
        ],
      },
      {
        name: 'Другие',
        items: [
          {
            name: 'Произвольное задание',
          },
        ],
      },
      {
        name: 'Подсказка',
        data: {
          view: 'BLOCK',
          type: 'HINT',
          content: {
            text: 'Текст подсказки',
          },
        },
      },
    ],
  },
];

const Widgets = ({
  editorState,
  changeEditorState,
}) => (
  <div className={styles.widgets}>
    {menu.map((section, index) =>
      <AntDropdown
        key={index}
        trigger={['click']}
        overlay={
          <AntMenu
            onClick={({ item }) =>
              insertEntity(
                editorState,
                changeEditorState
              )(item.props.data)
            }
          >
            {section.items.map((
              item,
              itemIndex
            ) =>
              item.items
              ?
                <AntMenu.SubMenu
                  key={itemIndex}
                  title={item.name}
                >
                  {item.items.map((
                    subitem,
                    subitemIndex
                  ) =>
                    <AntMenu.Item
                      key={subitemIndex}
                      data={subitem.data}
                      disabled={!subitem.data}
                    >
                      <AntIcon
                        type={subitem.icon}
                      />
                      {subitem.name}
                    </AntMenu.Item>
                  )}
                </AntMenu.SubMenu>
              :
                <AntMenu.Item
                  key={itemIndex}
                  data={item.data}
                  disabled={!item.data}
                >
                  {item.name}
                </AntMenu.Item>
            )}
          </AntMenu>
        }
      >
        <AntButton style={{ marginRight: 10 }}>
          <AntIcon type={section.icon} />
          {section.name}
          <AntIcon type="down" />
        </AntButton>
      </AntDropdown>
    )}
  </div>
);

Widgets.propTypes = {
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
  // menu: PropTypes.array.isRequired,
};

export default Widgets;
