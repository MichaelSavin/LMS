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
              content: '',
            },
            {
              name: 'Блок 2',
              info: 'Информация о блоке',
              content: '',
            },
          ],
        },
        {
          name: 'Подсекция 2',
          units: [
            {
              name: 'Блок 1',
              info: 'Информация о блоке',
              content: '',
            },
          ],
        },
        {
          name: 'Подсекция 3',
        },
      ],
    },
    {
      name: 'Секция 2',
    },
  ],
};

export default course;
