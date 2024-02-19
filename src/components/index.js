import "../pages/index.css";
import { 
	initialCards 
} from "./cards.js";
import { 
	createCard, 
	cardDelete, 
	handleCardLikeCallback, 
	deleteCardCallback
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
	validationConfig,
  enableValidation,
  clearValidation,
  checkInputValidity,
	toggleButtonState,
	setEventListeners,
	showInputError,
	hideInputError,
	hasInvalidInput,
} from './validation.js';
import { 
	getCards,
	updateUserInfoApi, 
	addCard, 
	getUserProfile, 
	checkImageValidity, 
	updateAvatar 
} from './api.js';
import { 
	cardContainer,
	imagePopup,
	cardImage,
	imageCaption,
	editPopup,
	editForm,
	nameInput,
	aboutInput,
	userProfileCard,
	userName,
	userAbout,
	editProfileButton,
	profileForm,
	formElement,
	editAvatarIcon,
	avatarPopup,
	avatarLinkInput,
	updateAvatarButton,
	editModal,
	addModal,
	editButton,
	addButton,
	closeButtons
} from './constants.js';


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
});

// Добавляем слушатель событий на .profile__image
editAvatarIcon.addEventListener('click', () => {
  // Открываем модальное окно
  openModal(avatarPopup);
});
avatarPopup.addEventListener('click', handleModalOverlayClick);

function updateUserInfo(modal) {
  const newName = nameInput.value;
  const newAbout = aboutInput.value;
	  // Получаем кнопку в форме
		const saveButton = modal.querySelector('.popup__button');

		// Сохраняем оригинальный текст кнопки
		const originalButtonText = saveButton.textContent;
	
		// Изменяем текст кнопки на "Сохранение..."
		saveButton.textContent = 'Сохранение...';

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
    })
		.finally(() => {
      // Восстанавливаем оригинальный текст кнопки в любом случае (успех или ошибка)
      saveButton.textContent = originalButtonText;
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


// Сохраняем id после первоначального запроса данных пользователя
const loadData = () => {
  Promise.all([getUserProfile(), getCards()])
    .then(([userInfo, cards]) => {
			setCurrentUserId(userInfo._id); // Сохраняем id пользователя
			updateProfileInfo(userInfo); // Обновляем информацию о пользователе после получения
      
			      // Получаем значение currentUserId из card.js
						const currentUserId = getCurrentUserId();
						console.log("Current User ID in loadData:", currentUserId);

			// Обрабатываем полученные карточки здесь
			addCards(
        cardDelete,
        openImagePopupCallback,
        handleCardLikeCallback,
				currentUserId
      );
			cards.forEach(card => {
        // Проверяем, является ли текущий пользователь владельцем карточки
        const isOwner = card.owner._id === currentUserId;
				// Создаем карточку, передавая флаг isOwner
        const cardElement = createCard(card, deleteCardCallback, openImagePopupCallback, handleCardLikeCallback, isOwner, currentUserId);

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


let currentUserId = "";

export function setCurrentUserId(userId) {
  currentUserId = userId;
}

export function getCurrentUserId() {
  return currentUserId;
}

function addCards(
  deleteCardCallback,
  openImagePopupCallback,
  handleCardLikeCallback,
	currentUserId
) {
  getCards()
    .then(cards => {
			if (!cards || !Array.isArray(cards)) {
        console.error('Error: Invalid cards data received from the server.');
        return;
      }

			const cardContainer = document.querySelector(".places__list");
			// Promise.all([getUserProfile(), getCards()])
			// .then(([userInfo, cards]) => {
			// 	setCurrentUserId(userInfo._id); // Установите значение currentUserId при получении данных пользователя
			// updateProfileInfo(userInfo);
			const currentUserId = getCurrentUserId();
			console.log("Current User ID in addCards:", currentUserId);
			
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
				isOwner,
				currentUserId
			);
			console.log("Created card element:", cardElement);
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
  button.addEventListener("click", () => closeModal(button.closest(".popup")));
});

document.addEventListener("keydown", handleModalEscPress);
document.addEventListener("click", handleModalOverlayClick);

// добавляем пользовательскую карточку
const addCardForm = document.forms.newPlace;

// Обработчик события открытия модального окна при нажатии на кнопку "Добавить карточку"
addButton.addEventListener("click", function () {
	addCardForm.reset();
  openModal(addModal);
});

const modalTriggerElement = document.getElementById('modalTriggerAddButton'); 
modalTriggerElement.addEventListener('click', function() {
  const formElement = document.getElementById('popupAddFormId');
  clearValidation(formElement, validationConfig);
	enableValidation(validationConfig);
toggleButtonState(profileForm, Array.from(profileForm.querySelectorAll('.popup__input')), profileForm.querySelector('.popup__button'), validationConfig);
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
        cardDelete,
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

// Загрузка информации о пользователе и начальных карточек и обновление элементов на странице
const userNameElement = document.querySelector('.profile__title');
const userAboutElement = document.querySelector('.profile__description');
const userAvatarElement = document.querySelector('.profile__image');



// // Использование запроса на получение карточек
// getCards()
//   .then(cards => {
//     console.log(cards);
// })
//   .catch(error => {
//     console.error('Error:', error);
//   });

// // Использование запроса на получение информации о пользователе
// getUserProfile()
//   .then(user => {
//     console.log(user._id);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });

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