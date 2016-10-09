import React, {
  // PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Menu as AntMenu,
  Button as AntButton,
  Dropdown as AntDropdown,
} from 'antd';

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
        action: () => {},
      },
      {
        name: 'Изображение', // Image
        action: () => {},
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
        name: 'Таблица',
      },
      {
        name: 'Слайдер',
      },
      {
        name: 'Формула', // TeX
        action: () => {},
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
            name: 'Ввод ответа', // Input
            action: () => {},
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
            name: 'Выбор из списка', // Select
            action: () => {},
          },
          {
            name: 'Укажи на картинке',
          },
          {
            name: 'Развернутый ответ', // Textarea
            action: () => {},
          },
          {
            name: 'Единственный выбор', // Radio
            action: () => {},
          },
          {
            name: 'Множественный выбор', // Checkbox
            action: () => {},
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
    ],
  },
];

const Widgets = () => (
  <div className={styles.widgets}>
    {menu.map((section, index) =>
      <AntDropdown
        key={index}
        trigger={['click']}
        overlay={
          <AntMenu>
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
                      onClick={subitem.action}
                      disabled={!subitem.action}
                    >
                      {subitem.name}
                    </AntMenu.Item>
                  )}
                </AntMenu.SubMenu>
              :
                <AntMenu.Item
                  key={itemIndex}
                  onClick={item.action}
                  disabled={!item.action}
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
  // menu: PropTypes.array.isRequired,
};

export default Widgets;
