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
        data: {
          view: 'BLOCK',
          type: 'UPLOAD',
          content: {
            files: [{
              uid: -1,
              name: 'Картинка 1.png',
              status: 'done',
              url: 'https://img3.goodfon.ru/wallpaper/middle/8/de/vincent-willem-van-gogh-wheat.jpg',
            }, {
              uid: -2,
              name: 'Картинка 2.png',
              status: 'done',
              url: 'https://img2.goodfon.ru/wallpaper/middle/7/f0/zhivopis-orlovskiy-vid-na.jpg',
            }, {
              uid: -3,
              name: 'Картинка 3.png',
              status: 'done',
              url: 'https://img2.goodfon.ru/wallpaper/middle/7/f0/zhivopis-orlovskiy-vid-na.jpg',
            }],
          },
        },
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
        data: {
          view: 'INLINE',
          type: 'TAG',
          content: {
            text: 'Тэг',
          },
        },
      },
      {
        name: 'Оценка',
        data: {
          view: 'INLINE',
          type: 'RATE',
        },
      },
      {
        name: 'Дерево',
        data: {
          view: 'BLOCK',
          type: 'TREE',
          content: {
            tree: {},
          },
        },
      },
      {
        name: 'Таблица',
        data: {
          view: 'BLOCK',
          type: 'TABLE',
          content: {
            rows: {},
          },
        },
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
        data: {
          view: 'BLOCK',
          type: 'CARD',
          content: {
            title: 'Информация',
            text: 'Контент',
          },
        },
      },
      {
        name: 'Карусель',
        data: {
          view: 'BLOCK',
          type: 'CAROUSEL',
          content: {
            images: [
              'https://img2.goodfon.ru/wallpaper/middle/b/4e/treehouse-point-ssha.jpg',
              'https://img3.goodfon.ru/wallpaper/middle/7/e6/kedr-shishki-hvoya-zelen-cedar.jpg',
              'https://img1.goodfon.ru/wallpaper/middle/a/8b/zemlyanika-polevye-cvety-trava.jpg',
              'https://img1.goodfon.ru/wallpaper/middle/a/98/griby-boroviki-parochka.jpg',
            ],
          },
        },
      },
      {
        name: 'Прогресс',
        data: {
          view: 'BLOCK',
          type: 'PROGRESS',
          content: {
            percent: 50,
          },
        },
      },
      {
        name: 'Развернуть',
        data: {
          view: 'BLOCK',
          type: 'COLLAPSE',
          content: {
            rows: {},
          },
        },
      },
      {
        name: 'Шкала времени',
        data: {
          view: 'BLOCK',
          type: 'TIMELINE',
          content: {
            steps: [
              'Первое событие',
              'Второе событие',
              'Третье событие',
              'Четвертое событие',
              'Пятое событие',
            ],
          },
        },
      },
      {
        name: 'Обратите внимание',
        data: {
          view: 'BLOCK',
          type: 'ALERT',
          content: {
            message: 'Обратите внимание',
          },
        },
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
            name: 'Слайдер',
            data: {
              view: 'BLOCK',
              type: 'SLIDER',
              content: {
                value: 50,
                scale: [-100, 500],
              },
            },
          },
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
            name: 'Перемещение',
            data: {
              view: 'BLOCK',
              type: 'TRANSFER',
              content: {
                options: [
                  'Берн',
                  'Лозанна',
                  'Давос',
                  'Базель',
                  'Брюгге',
                  'Льеж',
                  'Гент',
                  'Шарлеруа',
                ],
                keys: [],
                titles: [
                  'Бельгия',
                  'Швейцария',
                ],
              },
            },
          },
          {
            name: 'Переключатель',
            data: {
              view: 'INLINE',
              type: 'SWITCH',
              content: {
                checked: false,
              },
            },
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
