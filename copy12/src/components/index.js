// в файле index.js описана инициализация
// приложения и основная логика страницы:
// поиск DOM-элементов на странице и навешивание
// на них обработчиков событий; обработчики
// отправки форм, функция-обработчик события
// открытия модального окна для редактирования
// профиля; функция открытия модального окна изображения
// карточки. Также в index.js находится код, который
// отвечает за отображение шести карточек при открытии страницы.
// Импорты
import "../pages/index.css";
import {
  initialCards
} from "./cards.js";
import {
  createCard,
  cardDelete,
  handleCardLikeCallback,
  deleteCardCallback,
  currentUserId,
  isOwner
} from "./card.js";
import {
  openModal,
  closeModal,
  handleModalOverlayClick,
  setModalClickListener,
  handleModalEscPress,
  fillProfileForm
} from "./modal.js";
import {
  getCards,
  updateUserInfoApi,
  addCard,
  getUserProfile,
  checkImageValidity,
  updateAvatar
} from './api.js';
// import {  } from './validation';

// Сохраняем элементы DOM в переменные
const cardContainer = document.querySelector(".places__list");
const imagePopup = document.querySelector(".popup_type_image");
const cardImage = imagePopup.querySelector(".popup__image");
const imageCaption = imagePopup.querySelector(".popup__caption");
const editPopup = document.querySelector(".popup_type_edit");
const editForm = document.forms.editProfile;
const profileForm = document.querySelector(".popup__form");
const namePopupInput = profileForm.querySelector(".popup__input_type_name");
const descriptionInput = profileForm.querySelector(".popup__input_type_description");
const placeNameInput = profileForm.querySelector(".popup__input_type_card-name");
const linkInput = profileForm.querySelector(".popup__input_type_url");
const editAvatarIcon = document.querySelector(".profile__image");
const avatarPopup = document.querySelector(".popup_type_edit-avatar");
const avatarLinkInput = document.getElementById("avatarLink");
const updateAvatarButton = document.getElementById("SaveAvatarButton");
const userNameElement = document.querySelector(".profile__title");
const userAboutElement = document.querySelector(".profile__description");
const userAvatarElement = document.querySelector(".profile__image");
const nameInput = editForm.elements.name;
const aboutInput = editForm.elements.description;
const userProfileCard = document.querySelector(".profile__info");
const userName = userProfileCard.querySelector(".profile__title");
const userAbout = userProfileCard.querySelector(".profile__description");
const editProfileButton = userProfileCard.querySelector(
  ".profile__edit-button"
);
const formElement = document.querySelector('.popup__form');
export const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};
const editModal = document.querySelector(".popup_type_edit");
const addModal = document.querySelector(".popup_type_new-card");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const closeButtons = document.querySelectorAll(".popup__close");

editProfileButton.addEventListener("click", function () {
  nameInput.value = userName.textContent;
  aboutInput.value = userAbout.textContent;
  openModal(editPopup, editForm);
	fillProfileForm(editForm);
	clearValidation(profileForm, validationConfig);
enableValidation(validationConfig);
toggleButtonState(profileForm, Array.from(profileForm.querySelectorAll('.popup__input')), profileForm.querySelector('.popup__button'), validationConfig);
hideInputError(profileForm, namePopupInput, nameError, validationConfig);
hideInputError(profileForm, descriptionInput, descriptionError, validationConfig);
hideInputError(profileForm, placeNameInput, placeNameError, validationConfig);
hideInputError(profileForm, linkInput, linkError, validationConfig);
});

// Обработчик для кнопки редактирования аватара
editAvatarIcon.addEventListener("click", () => openModal(avatarPopup));

// Обработчики модальных окон
setModalClickListener(editModal, handleModalOverlayClick);
setModalClickListener(addModal, handleModalOverlayClick);

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

	// Проверяем, есть ли уже карточки в контейнере
	if (cardContainer.children.length === 0) {
		for (let card of cards) {
			// Проверяем, является ли текущий пользователь владельцем карточки
			const isOwner = card.owner._id === currentUserId;
			const cardElement = createCard(
				card,
				deleteCardCallback,
				openImagePopupCallback,
				handleCardLikeCallback,
				isOwner
			);
			// console.log("Created card element:", cardElement);
				// Добавляем новую карточку в начало контейнера
cardContainer.prepend(cardElement);
}
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

// Обработчик кнопки добавления новой карточки
addButton.addEventListener("click", () => openModal(addModal));

// Обработчик события submit формы добавления карточки
addCardForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const placeNameInput = addCardForm.elements.placeName;
  const linkInput = addCardForm.elements.link;

// Обработчик формы добавления новой карточки
addCardForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const placeNameInput = addCardForm.elements.placeName;
  const linkInput = addCardForm.elements.link;

  try {
    const newCard = await addCard(placeNameInput.value, linkInput.value);
    const cardElement = createCard(newCard, cardDelete, openImagePopupCallback, handleCardLikeCallback);
    cardContainer.prepend(cardElement);
    closeModal(addModal);
    addCardForm.reset();
  } catch (error) {
    console.error('Error adding card:', error);
  }
});
});

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

const nameError = profileForm.querySelector('#name-input-error');
const descriptionError = profileForm.querySelector('#about-input-error');
const placeNameError = profileForm.querySelector('#place-input-error');
const linkError = profileForm.querySelector('#link-input-error');

profileForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
});

// Добавим события для инпутов
// const namePopupInput = profileForm.querySelector('.popup__input_type_name');
// const descriptionInput = profileForm.querySelector('.popup__input_type_description');
// const placeNameInput = profileForm.querySelector('.popup__input_type_card-name');
// const linkInput = profileForm.querySelector('.popup__input_type_url');

// Проверка наличия элементов перед добавлением обработчиков
if (namePopupInput) {
  namePopupInput.addEventListener('input', function () {
    checkInputValidity(profileForm, namePopupInput, nameError, validationConfig);
  });
}

if (descriptionInput) {
  descriptionInput.addEventListener('input', function () {
    checkInputValidity(profileForm, descriptionInput, descriptionError, validationConfig);
  });
}

if (placeNameInput) {
  placeNameInput.addEventListener('input', function () {
    checkInputValidity(profileForm, placeNameInput, placeNameError, validationConfig);
  });
}

if (linkInput) {
  linkInput.addEventListener('input', function () {
    checkInputValidity(profileForm, linkInput, linkError, validationConfig, 'link');
  });
}


// Функция очистки валидации
export function clearValidation(formElement, config) {
   // Очищаем значения полей и ошибок
	const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
	inputList.forEach(inputElement => {
		const errorElement = inputElement.nextElementSibling;
		hideInputError(formElement, inputElement, errorElement, config);
		inputElement.value = '';
	});
	
	 // Очищаем общие ошибки формы
	const errorList = Array.from(formElement.querySelectorAll(config.inputErrorClass));
	errorList.forEach(errorElement => {
		errorElement.textContent = '';
		errorElement.classList.remove(config.errorClass);
	});

// Сбрасываем состояние кнопки
const buttonElement = formElement.querySelector(config.submitButtonSelector);
toggleButtonState(formElement, inputList, buttonElement, config);

// Сбрасываем форму
formElement.reset();
  };


// Загрузка данных
const loadData = async () => {
  try {
    const [userInfo, cards] = await Promise.all([getUserProfile(), getCards()]);
    updateProfileInfo(userInfo);
    addCards(cards);
  } catch (error) {
    console.error("Error:", error);
  }
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

// Обработчик кнопки обновления аватара
updateAvatarButton.addEventListener("click", async () => {
  const newAvatarUrl = avatarLinkInput.value;
  console.log('Avatar URL to be sent:', newAvatarUrl);

  try {
    const data = await updateAvatar({ avatar: newAvatarUrl });
    console.log('Аватар успешно обновлен', data);
    closeModal(avatarPopup);
  } catch (error) {
    console.error('Ошибка при обновлении аватара', error);
  }
});
