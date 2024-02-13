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
import { createCard, сardDelete, handleCardLikeCallback, deleteCardCallback } from "./card.js";
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
import { getCards,updateUserInfoApi, addCard, getUserProfile, checkImageValidity, deleteCard, updateAvatar } from './api.js';

document.addEventListener('DOMContentLoaded', function () {
const cardContainer = document.querySelector(".places__list");
const imagePopup = document.querySelector(".popup_type_image");
const cardImage = imagePopup.querySelector(".popup__image");
const imageCaption = imagePopup.querySelector(".popup__caption");

// Настройки валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

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
const profileForm = document.querySelector('.popup__form');
const namePopupInput = profileForm.querySelector('.popup__input_type_name');
const descriptionInput = document.querySelector('.popup__input_type_description');
const placeNameInput = document.querySelector('.popup__input_type_card-name');
const linkInput = document.querySelector('.popup__input_type_url');
const formElement = document.querySelector('.popup__form');

// Редактируем аватарку
const editAvatarIcon = document.querySelector('.profile__image');
const avatarPopup = document.querySelector('.popup_type_edit-avatar');
const avatarLinkInput = document.getElementById('avatarLink');
const updateAvatarButton = document.getElementById('SaveAvatarButton');

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
// function updateUserInfo(modal) {
//   const newName = nameInput.value;
//   const newAbout = aboutInput.value;

//   // Вызываем функцию для обновления данных пользователя на сервере
//   updateUserInfoApi(newName, newAbout)
//     .then(updatedUserInfo => {
//       console.log('Данные профиля обновлены:', updatedUserInfo);

//       // Обновляем информацию на странице
//       userName.textContent = updatedUserInfo.name;
//       userAbout.textContent = updatedUserInfo.about;
//       // Закрываем модальное окно
//       closeModal(modal);
//     })
//     .catch(error => {
//       console.error('Ошибка при обновлении данных профиля:', error);
//     });
// }
function updateUserInfo(modal) {
  const newName = nameInput.value;
  const newAbout = aboutInput.value;

  // Вызываем функцию для обновления данных пользователя на сервере
  updateUserInfoApi(newName, newAbout)
    .then(updatedUserInfo => {
      console.log('Данные профиля обновлены:', updatedUserInfo);

      // Обновляем информацию на странице
      updateProfileInfo(updatedUserInfo); // Добавлена эта строка для обновления DOM
      closeModal(modal);
    })
    .catch(error => {
      console.error('Ошибка при обновлении данных профиля:', error);
    });
}

// Функция для обновления информации в DOM
function updateProfileInfo(userInfo) {
  userName.textContent = userInfo.name;
  userAbout.textContent = userInfo.about;
  userAvatarElement.style.backgroundImage = `url(${userInfo.avatar})`;
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
async function checkInputValidity(formElement, inputElement, errorElement, config) {
  const isNameValid = /^[A-Za-zА-Яа-яЁё\s-]{2,40}$/.test(inputElement.value);
  const isDescriptionValid = /^[A-Za-zА-Яа-яЁё\s-]{2,200}$/.test(inputElement.value);
  const isPlaceNameValid = /^([a-zA-Zа-яА-Яё]+([- ]+[a-zA-Zа-яА-Яё]+)*){2,30}/.test(inputElement.value);
  const isLinkValid = /\.(jpeg|jpg|png|gif|bmp)$/i.test(inputElement.value);

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
        } else {
          const isImageURLValid = await checkImageValidity(inputElement.value);
          if (!isImageURLValid) {
            showInputError(formElement, inputElement, errorElement, 'Введите корректную ссылку на изображение', config);
          }
        }
			break;
		default:
			break;
	}
	}
}

const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');
  toggleButtonState(formElement, inputList, buttonElement);



// Функция переключения состояния кнопки
function toggleButtonState(formElement, inputList, buttonElement) {
  const isFormValid = inputList.every((inputElement) => inputElement.validity.valid);

  if (isFormValid) {
    buttonElement.classList.remove('popup__button_disabled');
    buttonElement.disabled = false;
  } else {
    buttonElement.classList.add('popup__button_disabled');
    buttonElement.disabled = true;
  }
}

// Функция установки обработчиков событий
function setEventListeners(formElement, config, inputList, buttonElement) {
  inputList.forEach((inputElement) => {
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


// Получаем информацию о текущем пользователе
const currentUserId = "c5e7b998f871f8fa8c4bb293";
// Функция проверки, является ли пользователь владельцем карточки
function isOwner(cardId) {
  // Находим карточку по идентификатору
  const card = findCardById(cardId);
  return card && card.owner._id === currentUserId;
}
// Определение функции deleteCardCallback
function deleteCardCallback(cardId) {
 // Вызываем функцию удаления карточки
  deleteCard(cardId)
  .then(() => {
    console.log('Card deleted successfully:', cardId);
	})
	.catch(error => {
		console.error('Error deleting card:', error);
	});
}
// Определение функции findCardById
function findCardById(cardId) {
  // Ваш код поиска карточки по идентификатору
  // Предположим, что у вас есть массив cards, содержащий объекты карточек
  return cards.find((card) => card._id === cardId) || null;
}

// // Загрузка информации о пользователе и начальных карточек и обновление элементов на странице
const userNameElement = document.querySelector('.profile__title');
const userAboutElement = document.querySelector('.profile__description');
const userAvatarElement = document.querySelector('.profile__image');

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
			cards.forEach(card => {
        // Проверяем, является ли текущий пользователь владельцем карточки
        const isOwner = card.owner._id === userInfo._id;
				// Создаем карточку, передавая флаг isOwner
        const cardElement = createCard(card, deleteCardCallback, openImagePopupCallback, handleCardLikeCallback, isOwner);

        // Добавляем карточку в DOM
        cardContainer.append(cardElement);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

// Загрузка информации о пользователе и начальных карточек при загрузке страницы
loadData();


// Использование запроса на получение карточек
getCards()
  .then(cards => {
    console.log(cards);
})
  .catch(error => {
    console.error('Error:', error);
  });

// Использование запроса на получение информации о пользователе
getUserProfile()
  .then(userInfo => {
    console.log(userInfo);
  })
  .catch(error => {
    console.error('Error:', error);
  });

updateAvatarButton.addEventListener('click', () => {
  const newAvatarUrl = avatarLinkInput.value;
	console.log('Avatar URL to be sent:', newAvatarUrl);
  updateAvatar({ avatar: newAvatarUrl })
    .then((data) => {
      console.log('Аватар успешно обновлен', data);
			closeModal(avatarPopup);
    })
    .catch((error) => {
      console.error('Ошибка при обновлении аватара', error);
    });
});
})
