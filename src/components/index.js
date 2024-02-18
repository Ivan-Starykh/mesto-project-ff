import "../pages/index.css";
import { 
	initialCards 
} from "./cards.js";
import { 
	createCard, 
	cardDelete, 
	handleCardLikeCallback, 
	deleteCardCallback,  
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

export function resetFormInputs() {
  const formInputs = document.querySelectorAll('.popup__input');
  formInputs.forEach(input => {
    input.value = '';
  });
}
export function resetErrorMessages() {
  const errorSpans = document.querySelectorAll('.popup__input_type_error');
  errorSpans.forEach(span => {
    span.textContent = '';
		span.style.borderColor = 'rgba(0, 0, 0, 0.2)';
  });
}

// добавляем пользовательскую карточку
const addCardForm = document.forms.newPlace;

// Обработчик события открытия модального окна при нажатии на кнопку "Добавить карточку"
addButton.addEventListener("click", function () {
	addCardForm.reset();
	clearValidation(profileForm, validationConfig);
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

// Сохраняем id после первоначального запроса данных пользователя
export let currentUserId = "";
const loadData = () => {
  Promise.all([getUserProfile(), getCards()])
    .then(([userInfo, cards]) => {
			currentUserId = userInfo._id; // Сохраняем id пользователя
			updateProfileInfo(userInfo); // Обновляем информацию о пользователе после получения
      // Обрабатываем полученные карточки здесь
			addCards(
        cardDelete,
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
  .then(user => {
    console.log(user._id);
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