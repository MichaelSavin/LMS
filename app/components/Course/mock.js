import { convertToRaw, ContentState } from 'draft-js';

const content = convertToRaw(ContentState.createFromText(''));

const course = {
  name: 'Тестовый курс',
  info: 'Краткая информация о курсе',
  sections: [
    {
      name: 'Секция 1',
      subsections: [
        {
          name: 'Подсекция 1',
          units: [
            {
              name: 'Блок 1',
              info: 'Информация о блоке',
              content,
            },
            {
              name: 'Блок 2',
              info: 'Информация о блоке',
              content,
            },
            {
              name: 'Блок 3',
              info: 'Информация о блоке',
              content,
            },
          ],
        },
        {
          name: 'Подсекция 2',
          units: [
            {
              name: 'Блок 1',
              info: 'Информация о блоке',
              content,
            },
            {
              name: 'Блок 2',
              info: 'Информация о блоке',
              content,
            },
          ],
        },
        {
          name: 'Подсекция 3',
          units: [
            {
              name: 'Блок 1',
              info: 'Информация о блоке',
              content,
            },
            {
              name: 'Блок 2',
              info: 'Информация о блоке',
              content,
            },
          ],
        },
      ],
    },
  ],
};

export default course;
