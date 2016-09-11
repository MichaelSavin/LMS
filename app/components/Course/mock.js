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
              content: 'Содержание блока 1',
            },
            {
              name: 'Блок 2',
              info: 'Информация о блоке',
              content: 'Содержание блока 2',
            },
          ],
        },
        {
          name: 'Подсекция 2',
          units: [
            {
              name: 'Блок 1',
              info: 'Информация о блоке',
              content: `Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

Inline-style: 
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

Reference-style: 
![alt text][logo]

[logo]: https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 2"`,
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
