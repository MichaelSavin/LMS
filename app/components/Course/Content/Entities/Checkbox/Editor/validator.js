/* eslint-disable */
export default (content) => {
  const errors = {};
  content.variants.forEach((variant, variantIndex) => {
    if (!variant.question) { errors[`variants[${variantIndex}].question`] = `Необходимо указать вопрос в варианте №${variantIndex + 1}`; }
    if (!variant.attempts) { errors[`variants[${variantIndex}].attempts`] = `Необходимо указать количество попыток в варианте №${variantIndex + 1}`; }
    if (!variant.points) { errors[`variants[${variantIndex}].points`] = `Необходимо указать количество баллов в варианте №${variantIndex + 1}`; }
    if (!(variant.options.length > 0)) { errors[`variants[${variantIndex}].options`] = `Необходимо добавить варианты ответов в варианте №${variantIndex + 1}`; }
    variant.options.forEach((option, optionIndex) => { if (!option.text) { errors[`variants[${variantIndex}].options[${optionIndex}].text`] = `Необходимо указать текст ответа №${optionIndex + 1} в варианте №${variantIndex + 1}`; }});
    if (!variant.options.some((option) => option.isCorrect === true)) { errors[`variants[${variantIndex}].options.checked`] = `Необходимо выбрать правильные варианты ответов в варианте №${variantIndex + 1}`; }
    if (!(variant.hints.length > 0)) { errors[`variants[${variantIndex}].hints`] = `Необходимо добавить подсказки в варианте №${variantIndex + 1}`; }
    if (!(variant.competences.length > 0)) { errors[`variants[${variantIndex}].competences`] = `Необходимо добавить компетенции в варианте №${variantIndex + 1}`; }
    if (!(variant.explanations.length > 0)) { errors[`variants[${variantIndex}].explanations`] = `Необходимо добавить пояснения в варианте №${variantIndex + 1}`; }
    variant.hints.forEach((hint, hintIndex) => { if (!hint.text) { errors[`variants[${variantIndex}].hints[${hintIndex}].text`] = `Необходимо указать текст подсказки №${optionIndex + 1} в варианте №${variantIndex + 1}`; }});
    variant.competences.forEach((competence, competenceIndex) => { if (!competence.text) { errors[`variants[${variantIndex}].competences[${competenceIndex}].text`] = `Необходимо указать текст компетенции №${competenceIndex + 1} в варианте №${variantIndex + 1}`; }});
    variant.explanations.forEach((explanation, explanationIndex) => { if (!explanation.text) { errors[`variants[${variantIndex}].explanations[${explanationIndex}].text`] = `Необходимо указать текст пояснения №${explanationIndex + 1} в варианте №${variantIndex + 1}`; }});
  });
  return errors;
};
/* eslint-enable */
