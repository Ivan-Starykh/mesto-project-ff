// в файле index.js описана инициализация
// приложения и основная логика страницы:
// поиск DOM-элементов на странице и навешивание
// на них обработчиков событий; обработчики
// отправки форм, функция-обработчик события
// открытия модального окна для редактирования
// профиля; функция открытия модального окна изображения
// карточки. Также в index.js находится код, который
// отвечает за отображение шести карточек при открытии страницы.

import "../pages/index.css";
import { initialCards } from "./cards.js";
import { createCard, сardDelete, handleCardLikeCallback } from "./card.js";
import {
  openModal,
  closeModal,
  handleModalOverlayClick,
  setModalClickListener,
  handleModalEscPress,
	fillProfileForm
} from "./modal.js";
// Подключаем validation.js
// import {  } from './validation';
import { getCards,updateUserInfoApi, addCard, getUserProfile } from './api.js';

const cardContainer = document.querySelector(".places__list");
const imagePopup = document.querySelector(".popup_type_image");
const cardImage = imagePopup.querySelector(".popup__image");
const imageCaption = imagePopup.querySelector(".popup__caption");

// Редактируем профиль
const editPopup = document.querySelector(".popup_type_edit");
const editForm = document.forms.editProfile;
const nameInput = editForm.elements.name;
const aboutInput = editForm.elements.description;
const userProfileCard = document.querySelector(".profile__info");
const userName = userProfileCard.querySelector(".profile__title");
const userAbout = userProfileCard.querySelector(".profile__description");
const editProfileButton = userProfileCard.querySelector(
  ".profile__edit-button"
);

// Редактируем аватарку
	const editAvatarIcon = document.querySelector('.profile__image');
	const avatarPopup = document.querySelector('.popup_type_edit-avatar');
	// const closeButtons = document.querySelectorAll(".popup__close");
	const avatarLinkInput = document.getElementById('avatarLink');
	// const linkError = profileForm.querySelector('#link-input-error');
	// const userAvatarElement = document.querySelector('.profile__image');
	// const profileForm = document.querySelector('.popup__form');
	// const updateProfileButton = document.querySelector('.popup__button');

// Получаем элементы модальных окон
const editModal = document.querySelector(".popup_type_edit");
const addModal = document.querySelector(".popup_type_new-card");

// Получаем кнопки, которые открывают модальные окна
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");

// Получаем элементы для закрытия модальных окон
const closeButtons = document.querySelectorAll(".popup__close");

editProfileButton.addEventListener("click", function () {
  // Заполняем поля модальной формы
  nameInput.value = userName.textContent;
  aboutInput.value = userAbout.textContent;

  // Открываем модальное окно
  openModal(editPopup, editForm);

	 // Передаем форму в функцию fillProfileForm
	fillProfileForm(editForm);

	// Первоначальная очистка при открытии формы
	clearValidation(profileForm, validationConfig);
// Настройка валидации и состояния кнопки
enableValidation(validationConfig);
toggleButtonState(profileForm, Array.from(profileForm.querySelectorAll('.popup__input')), profileForm.querySelector('.popup__button'), validationConfig);

// Сбрасываем значения полей и ошибок
hideInputError(profileForm, namePopupInput, nameError, validationConfig);
hideInputError(profileForm, descriptionInput, descriptionError, validationConfig);
hideInputError(profileForm, placeNameInput, placeNameError, validationConfig);
hideInputError(profileForm, linkInput, linkError, validationConfig);
});

// Добавляем слушатель событий на .profile__image
editAvatarIcon.addEventListener('click', () => {
  // Открываем модальное окно
  openModal(avatarPopup);
});
avatarPopup.addEventListener('click', handleModalOverlayClick);

// Функция для обновления информации на сервере и закрытия модального окна
function updateUserInfo(modal) {
  const newName = nameInput.value;
  const newAbout = aboutInput.value;

  // Вызываем функцию для обновления данных пользователя на сервере
  updateUserInfoApi(newName, newAbout)
    .then(updatedUserInfo => {
      console.log('Данные профиля обновлены:', updatedUserInfo);

      // Обновляем информацию на странице
      userName.textContent = updatedUserInfo.name;
      userAbout.textContent = updatedUserInfo.description;

      // Закрываем модальное окно
      closeModal(modal);
    })
    .catch(error => {
      console.error('Ошибка при обновлении данных профиля:', error);
    });
}


// Обработчик события submit формы
editForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  updateUserInfo(editPopup);
});

// Устанавливаем слушатель клика по оверлею для каждого модального окна
setModalClickListener(editModal, handleModalOverlayClick);
setModalClickListener(addModal, handleModalOverlayClick);

addCards(
  // initialCards,
  сardDelete,
  openImagePopupCallback,
  handleCardLikeCallback
);

function addCards(
  deleteCardCallback,
  openImagePopupCallback,
  handleCardLikeCallback
) {
  getCards()
    .then(cards => {
			if (!cards || !Array.isArray(cards)) {
        console.error('Error: Invalid cards data received from the server.');
        return;
      }

			const cardContainer = document.querySelector(".places__list");

      for (let card of cards) {
        const cardElement = createCard(
          card,
          deleteCardCallback,
          openImagePopupCallback,
          handleCardLikeCallback
        );
        cardContainer.append(cardElement);
      }
    })
    .catch(error => {
      console.error('Error fetching cards:', error);
    });
}

function openImagePopupCallback(imageUrl, imageName) {
  cardImage.src = imageUrl;
  cardImage.alt = imageName;
  imageCaption.textContent = imageName;

  openModal(imagePopup);
}

// Обработчики событий для кнопок закрытия модальных окон
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".popup");
    closeModal(modal);
  });
});

// добавляем пользовательскую карточку
const addCardForm = document.forms.newPlace;

// Обработчик события открытия модального окна при нажатии на кнопку "Добавить карточку"
addButton.addEventListener("click", function () {
  openModal(addModal);
});

// Обработчик события submit формы добавления карточки
addCardForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  // Получаем значения из формы
  const placeNameInput = addCardForm.elements.placeName;
  const linkInput = addCardForm.elements.link;

	  // Вызываем функцию для добавления новой карточки на сервер
		addCard(placeNameInput.value, linkInput.value)
    .then(newCard => {
      // Создаем новую карточку на основе данных, полученных с сервера
      const cardElement = createCard(
        newCard,
        сardDelete,
        openImagePopupCallback,
        handleCardLikeCallback
      );

      // Добавляем новую карточку в начало контейнера
      cardContainer.prepend(cardElement);

      // Закрываем модальное окно
      closeModal(addModal);

      // Очищаем форму
      addCardForm.reset();
    })
    .catch(error => {
      console.error('Error adding card:', error);
    });
});


// валидация формы 

// Настройки валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

// Функция включения валидации
function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);

  forms.forEach((formElement) => {
    formElement.addEventListener('submit', function (evt) {
      evt.preventDefault();
    });

    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    setEventListeners(formElement, config, inputList, buttonElement);
    toggleButtonState(formElement, inputList, buttonElement, config);
  });
}

// Функция проверки валидности поля
function checkInputValidity(formElement, inputElement, errorElement, config) {
  const isNameValid = /^[A-Za-zА-Яа-яЁё\s-]{2,40}$/.test(inputElement.value);
  const isDescriptionValid = /^[A-Za-zА-Яа-яЁё\s-]{2,200}$/.test(inputElement.value);
  const isPlaceNameValid = /^([a-zA-Zа-яА-Яё]+([- ]+[a-zA-Zа-яА-Яё]+)*){2,30}/.test(inputElement.value);
  const isLinkValid = /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)$/.test(inputElement.value);

  if (inputElement.value.trim() === '') {
    showInputError(formElement, inputElement, errorElement, inputElement.validationMessage, config);
  } else {
    hideInputError(formElement, inputElement, errorElement, config);

	switch (inputElement.name) {
		case 'name':
			if (!isNameValid) {
				showInputError(formElement, inputElement, errorElement, 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы', config);
			}
			break;
		case 'description':
			if (!isDescriptionValid) {
				showInputError(formElement, inputElement, errorElement, 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы', config);
			}
			break;
		case 'placeName':
			if (!isPlaceNameValid) {
				showInputError(formElement, inputElement, errorElement, 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы', config);
			}
			break;
		case 'link':
			if (!isLinkValid) {
				showInputError(formElement, inputElement, errorElement, 'Введите корректную ссылку на изображение', config);
			}
			break;
		default:
			break;
	}
}

const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  toggleButtonState(formElement, inputList, buttonElement, config);
}


// Функция переключения состояния кнопки
function toggleButtonState(formElement, inputList, buttonElement, config) {
  const isFormValid = inputList.every((inputElement) => inputElement.validity.valid);

  if (isFormValid) {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  } else {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  }
}

// Функция установки обработчиков событий
function setEventListeners(formElement, config, inputList, buttonElement) {
  inputList.forEach((inputElement) => {
    // const errorElement = formElement.querySelector(`#${inputElement.name}-error`);
		const errorElement = inputElement.nextElementSibling;

    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement, errorElement, config);
      toggleButtonState(formElement, inputList, buttonElement, config);
    });
  });
}

// Функция отображения ошибки
function showInputError(formElement, inputElement, errorElement, errorMessage, config) {
  inputElement.classList.add(config.inputErrorClass);
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
  }
}

// Функция скрытия ошибки
function hideInputError(formElement, inputElement, errorElement, config) {
  if (errorElement) {
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.classList.remove(config.errorClass);
    errorElement.textContent = '';
  }
}

// Функция проверки наличия невалидных полей
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => !inputElement.validity.valid);
}

// Функция очистки валидации
function clearValidation(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const errorList = Array.from(formElement.querySelectorAll(config.inputErrorClass));

  inputList.forEach((inputElement) => {
		const errorElement = inputElement.nextElementSibling;
    hideInputError(formElement, inputElement, errorElement, config);
				
		if (inputElement) {
		inputElement.classList.remove(config.inputErrorClass);
		inputElement.value = '';
		}
				if (inputElement.name === 'link' || inputElement.name === 'placeName') {
      // Очищаем сообщения об ошибке для полей "link" и "placeName"
      const specificErrorElement = formElement.querySelector(`.popup__input_type_error`);
      hideInputError(formElement, inputElement, specificErrorElement, config);
    }
	});

	errorList.forEach((errorElement) => {
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove(config.errorClass); // удаление класса ошибки
    }
  });
	
  formElement.reset();// Очищаем всю форму
  };

const formElement = document.querySelector(validationConfig.formSelector);

toggleButtonState(formElement, Array.from(formElement.querySelectorAll('.popup__input')), formElement.querySelector('.popup__button'), validationConfig);

const profileForm = document.querySelector('.popup__form');


  // Первоначальная очистка при открытии формы
  clearValidation(profileForm, validationConfig);
enableValidation(validationConfig);
// Настройка валидации и состояния кнопки
enableValidation(validationConfig);
toggleButtonState(profileForm, Array.from(profileForm.querySelectorAll('.popup__input')), profileForm.querySelector('.popup__button'), validationConfig);

// Сбрасываем значения полей и ошибок
hideInputError(profileForm, placeNameInput, placeNameError, validationConfig);
  // Добавляем событие только после полной загрузки DOM
  placeNameInput.addEventListener('input', function () {
    checkInputValidity(profileForm, placeNameInput, placeNameError, validationConfig);
  });

const nameError = profileForm.querySelector('#name-input-error');
const descriptionError = profileForm.querySelector('#about-input-error');
const placeNameError = profileForm.querySelector('#place-input-error');
const linkError = profileForm.querySelector('#link-input-error');

profileForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
});

const namePopupInput = profileForm.querySelector('.popup__input_type_name');
const descriptionInput = profileForm.querySelector('.popup__input_type_description');
const placeNameInput = profileForm.querySelector('.popup__input_type_card-name');
const linkInput = profileForm.querySelector('.popup__input_type_url');

// Добавим события для инпутов
namePopupInput.addEventListener('input', function () {
  checkInputValidity(profileForm, namePopupInput, nameError, validationConfig);
});

descriptionInput.addEventListener('input', function () {
  checkInputValidity(profileForm, descriptionInput, descriptionError, validationConfig);
});

placeNameInput.addEventListener('input', function () {
  checkInputValidity(profileForm, placeNameInput, placeNameError, validationConfig);
});

linkInput.addEventListener('input', function () {
  checkInputValidity(profileForm, linkInput, linkError, validationConfig, 'link');
});



// Загрузка информации о пользователе и начальных карточек и обновление элементов на странице
const userNameElement = document.querySelector('.profile__title');
const userAboutElement = document.querySelector('.profile__description');
const userAvatarElement = document.querySelector('.profile__image');
      // Обновление элементов на странице с информацией о пользователе
function updateProfileInfo(userInfo) {
	userNameElement.textContent = userInfo.name;
	userAboutElement.textContent = userInfo.description;
	userAvatarElement.style.backgroundImage = `url(${userInfo.avatar})`;
}

const loadData = () => {
  Promise.all([getUserProfile(), getCards()])
    .then(([userInfo, cards]) => {
			updateProfileInfo(userInfo); // Обновляем информацию о пользователе после получения
      // Обрабатываем полученные карточки здесь
			addCards(
        сardDelete,
        openImagePopupCallback,
        handleCardLikeCallback
      );
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

// Обновление данных профиля
const handleProfileUpdate = () => {
  const newName = prompt('Введите новое имя');
  const newAbout = prompt('Введите новую информацию о себе');

  if (newName || newAbout) {
    updateUserInfoApi(newName, newAbout)
      .then(updatedUserInfoApi => {
        console.log('Данные профиля обновлены:', updatedUserInfoApi);
        loadData(); // Обновляем информацию о пользователе после успешного обновления
      })
      .catch(error => {
        console.error('Ошибка при обновлении данных профиля:', error);
      });
  }
};

// Загрузка информации о пользователе и начальных карточек при загрузке страницы
loadData();

// Добавляем событие для обновления данных профиля (например, по клику на кнопку)
const updateProfileButton = document.querySelector('.popup__button');
updateProfileButton.addEventListener('click', handleProfileUpdate);


// Использование запроса на получение карточек
getCards()
  .then(cards => {
    console.log(cards);
    // Обрабатывайте полученные карточки здесь
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Использование запроса на получение информации о пользователе
getUserProfile()
  .then(userInfo => {
    console.log(userInfo);
    // Обрабатывайте полученную информацию о пользователе здесь
  })
  .catch(error => {
    console.error('Error:', error);
  });
