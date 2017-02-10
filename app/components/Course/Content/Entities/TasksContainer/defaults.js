import { random } from 'lodash/fp';
import { EditorState, convertToRaw } from 'draft-js';

export const newOption = (isRaw) => ({
  id: `${random(0, 999)}`,
  editorState: isRaw ? convertToRaw(
    EditorState.createEmpty()
      .getCurrentContent()
  ) : EditorState.createEmpty(),
  text: 'Вариант 1',
  taskTitle: 'Заголовок',
});

class DefaultVariant {
  constructor(type) {
    this.type = type;
  }

  attempts = 1
  points = 1
  question = 'Вопрос один на всех'
  hints = [{
    text: 'Новая подсказка',
  }]
  competences = [{
    text: 'Новая компетенция',
  }]
  explanations = [{
    text: 'Новое объяснение',
  }]
  options = [
    newOption(this.type),
    newOption(this.type),
    newOption(this.type),
    newOption(this.type),
  ]
}

export default DefaultVariant;
