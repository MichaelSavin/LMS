/* eslint-disable */
export default (content) => {
  const errors = {};
  content.variants.forEach((variant, variantIndex) => {
    if (!variant.question) { errors[`variants[${variantIndex}].question`] = `Необходимо указать вопрос в варианте №${variantIndex + 1}`; }
    if (!variant.attempts) { errors[`variants[${variantIndex}].attempts`] = `Необходимо указать количество попыток в варианте №${variantIndex + 1}`; }
    if (!variant.points) { errors[`variants[${variantIndex}].points`] = `Необходимо указать количество баллов в варианте №${variantIndex + 1}`; }
    variant.options.forEach((option, optionIndex) => { if (!option.text) { errors[`variants[${variantIndex}].options[${optionIndex}].text`] = `Необходимо указать текст ответа №${optionIndex + 1} в варианте №${variantIndex + 1}`; }});
    if (!variant.options.some((option) => option.isCorrect === true)) { errors[`variants[${variantIndex}].options.checked`] = `Необходимо выбрать правильные варианты ответов в варианте №${variantIndex + 1}`; }
    if (!(variant.hints.length > 0)) { errors[`variants[${variantIndex}].hints`] = `Необходимо добавить подсказки в варианте №${variantIndex + 1}`; }
    if (!(variant.competences.length > 0)) { errors[`variants[${variantIndex}].competences`] = `Необходимо добавить компетенции в варианте №${variantIndex + 1}`; }
    if (!(variant.explanations.length > 0)) { errors[`variants[${variantIndex}].explanations`] = `Необходимо добавить пояснения в варианте №${variantIndex + 1}`; }
  });
  return errors;
};
