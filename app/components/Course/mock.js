import { convertToRaw, ContentState } from 'draft-js';

const content = convertToRaw(ContentState.createFromText(''));

const course = {
  id: `id${Math.random()}`,
  name: 'Тестовый курс',
  info: 'Краткая информация о курсе',
  sections: [
    {
      name: 'Раздел 1',
      subsections: [
        {
          name: 'Подраздел 1',
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
          name: 'Подраздел 2',
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
          name: 'Подраздел 3',
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
          name: 'Подраздел 4',
        },
        {
          name: 'Подраздел 5',
        },
      ],
    },
    {
      name: 'Раздел 2',
    },
  ],
};

export default course;
