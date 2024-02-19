import { checkImageValidity } from "./api.js";
import {
  profileForm,
  namePopupInput,
  descriptionInput,
  placeNameInput,
  linkInput,
} from "./constants.js";

// Настройки валидации
export const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Функция включения валидации
export function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach((formElement) => {
    formElement.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });

    const inputList = Array.from(
      formElement.querySelectorAll(config.inputSelector)
    );
    const buttonElement = formElement.querySelector(
      config.submitButtonSelector
    );
    setEventListeners(formElement, config, inputList, buttonElement);
    toggleButtonState(formElement, inputList, buttonElement, config);
  });
}

// Функция очистки валидации
export function clearValidation(formElement, config) {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const errorList = Array.from(
    formElement.querySelectorAll(config.inputErrorClass)
  );

  inputList.forEach((inputElement) => {
    const errorElement = inputElement.nextElementSibling;
    hideInputError(formElement, inputElement, errorElement, config);

		if (inputElement) {
      inputElement.classList.remove(config.inputErrorClass);
      if (inputElement.name !== "link" && inputElement.name !== "placeName") {
        inputElement.value = "";
      }
    }
    if (inputElement.name === "link" || inputElement.name === "placeName") {
      // Очищаем сообщения об ошибке для полей "link" и "placeName"
      const specificErrorElement = formElement.querySelector(
        config.inputErrorClass
      );
      hideInputError(formElement, inputElement, specificErrorElement, config);
    }
  });

  errorList.forEach((errorElement) => {
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.classList.remove(config.errorClass); // удаление класса ошибки
    }
  });

  formElement.reset(); // Очищаем всю форму
}

// Функция проверки валидности поля
export function checkInputValidity(
  formElement,
  inputElement,
  errorElement,
  config
) {
  // Сброс кастомных сообщений об ошибке
  inputElement.setCustomValidity("");

  if (inputElement.validity.patternMismatch) {
    // Если встроенная валидация не прошла, установим кастомное сообщение об ошибке
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  }

  if (!inputElement.validity.valid) {
    // Если валидация не прошла, покажем ошибку
    showInputError(
      formElement,
      inputElement,
      errorElement,
      inputElement.validationMessage,
      config
    );
  } else {
    // Если валидация прошла успешно, скроем ошибку
    hideInputError(formElement, inputElement, errorElement, config);
  }
}

// Функция переключения состояния кнопки
export function toggleButtonState(formElement, inputList, buttonElement) {
  const isFormValid = inputList.every(
    (inputElement) => inputElement.validity.valid
  );

  if (isFormValid) {
    buttonElement.classList.remove("popup__button_disabled");
    buttonElement.disabled = false;
  } else {
    buttonElement.classList.add("popup__button_disabled");
    buttonElement.disabled = true;
  }
}

// Функция установки обработчиков событий
export function setEventListeners(
  formElement,
  config,
  inputList,
  buttonElement
) {
  inputList.forEach((inputElement) => {
    const errorElement = inputElement.nextElementSibling;

    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, errorElement, config);
      toggleButtonState(formElement, inputList, buttonElement, config);
    });
  });
}

// Функция отображения ошибки
export function showInputError(
  formElement,
  inputElement,
  errorElement,
  errorMessage,
  config
) {
  inputElement.classList.add(config.inputErrorClass);
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
  }
}

// Функция скрытия ошибки
export function hideInputError(
  formElement,
  inputElement,
  errorElement,
  config
) {
  if (errorElement) {
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.classList.remove(config.errorClass);
    errorElement.textContent = "";
  }
}

// Функция проверки наличия невалидных полей
export function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => !inputElement.validity.valid);
}

const nameError = profileForm.querySelector("#name-input-error");
const descriptionError = profileForm.querySelector("#about-input-error");
const placeNameError = profileForm.querySelector("#place-input-error");
const linkError = profileForm.querySelector("#link-input-error");

profileForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
});
