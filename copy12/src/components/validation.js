export function enableValidation(config) {

  const forms = document.querySelectorAll(config.formSelector);

  forms.forEach((formElement) => {
    formElement.addEventListener('submit', function (evt) {
      evt.preventDefault();
    });

    setEventListeners(formElement, config);
  });
}

// function setEventListeners(formElement, config) {
//   const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
//   const buttonElement = formElement.querySelector(config.submitButtonSelector);

//   inputList.forEach((inputElement) => {
//     const errorElement = formElement.querySelector(`#${inputElement.name}-error`);
//     inputElement.addEventListener('input', function () {
//       checkInputValidity(formElement, inputElement, errorElement, config);
//       toggleButtonState(formElement, inputList, buttonElement, config);
//     });
//   });

//   toggleButtonState(formElement, inputList, buttonElement, config);
// }

// function checkInputValidity(formElement, inputElement, errorElement, config) {
//   // Ваша логика проверки валидности
//   // ...

//   // Пример кастомного сообщения
//   if (!isNameValid(inputElement.value)) {
//     const customErrorMessage = inputElement.dataset.customError || 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы';
//     showInputError(formElement, inputElement, errorElement, customErrorMessage, config);
//   } else {
//     hideInputError(formElement, inputElement, errorElement, config);
//   }
// }

// function toggleButtonState(formElement, inputList, buttonElement, config) {
//   if (hasInvalidInput(inputList)) {
//     buttonElement.disabled = true;
//     buttonElement.classList.add(config.inactiveButtonClass);
//   } else {
//     buttonElement.disabled = false;
//     buttonElement.classList.remove(config.inactiveButtonClass);
//   }
// }

// function showInputError(formElement, inputElement, errorElement, errorMessage, config) {
//   inputElement.classList.add(config.inputErrorClass);
//   errorElement.textContent = errorMessage;
//   errorElement.classList.add(config.errorClass);
// }

// function hideInputError(formElement, inputElement, errorElement, config) {
//   inputElement.classList.remove(config.inputErrorClass);
//   errorElement.classList.remove(config.errorClass);
//   errorElement.textContent = '';
// }

// // Другие функции, которые вам нужны для валидации, например, isNameValid, hasInvalidInput, и т.д.
