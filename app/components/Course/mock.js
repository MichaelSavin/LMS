const course = {
  name: 'Тестовый курс',
  info: 'Краткая информация',
  sections: {
    1: {
      name: 'Секция 1',
      subsections: {
        1: {
          name: 'Подсекция 1',
          units: {
            1: {
              name: 'Блок 1',
              info: 'Информация о блоке',
              content: {
                text: 'Содержание блока',
              },
            },
            2: {
              name: 'Блок 2',
              info: 'Информация о блоке',
            },
          },
        },
        2: {
          name: 'Подсекция 2',
          units: {
            1: {
              name: 'Упраженение 1',
              info: 'Информация об упражнении',
            },
          },
        },
        3: {
          name: 'Подсекция 3',
        },
      },
    },
    2: {
      sections: {
        1: {
          name: 'Секция 1',
        },
      },
    },
  },
};

export default course;
