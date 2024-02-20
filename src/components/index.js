import "../pages/index.css";
import {
  createCard,
  handleCardLikeCallback,
  deleteCardCallback,
} from "./card.js";
import {
  openModal,
  closeModal,
  handleModalOverlayClick,
  setModalClickListener,
  handleModalEscPress,
  fillProfileForm,
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
} from "./validation.js";
import {
  getCards,
  updateUserInfoApi,
  addCard,
  getUserProfile,
  checkImageValidity,
  updateAvatar,
} from "./api.js";
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
  closeButtons,
} from "./constants.js";

enableValidation(validationConfig);

editProfileButton.addEventListener("click", function () {
  nameInput.value = userName.textContent;
  aboutInput.value = userAbout.textContent;
  openModal(editPopup, editForm);
  fillProfileForm(editForm);
  clearValidation(profileForm, validationConfig);
  toggleButtonState(
    profileForm,
    Array.from(profileForm.querySelectorAll(".popup__input")),
    profileForm.querySelector(".popup__button"),
    validationConfig
  );
});

// Добавляем слушатель событий на .profile__image
editAvatarIcon.addEventListener("click", () => {
  // Открываем модальное окно
  openModal(avatarPopup);
});
avatarPopup.addEventListener("click", handleModalOverlayClick);

function updateUserInfo(modal) {
  const newName = nameInput.value;
  const newAbout = aboutInput.value;
  // Получаем кнопку в форме
  const saveButton = modal.querySelector(".popup__button");

  // Сохраняем оригинальный текст кнопки
  const originalButtonText = saveButton.textContent;

  // Изменяем текст кнопки на "Сохранение..."
  saveButton.textContent = "Сохранение...";

  // Вызываем функцию для обновления данных пользователя на сервере
  updateUserInfoApi(newName, newAbout)
    .then((updatedUserInfo) => {
      console.log("Данные профиля обновлены:", updatedUserInfo);

      // Обновляем информацию на странице
      updateProfileInfo(updatedUserInfo); // Добавлена эта строка для обновления DOM
      closeModal(modal);
    })
    .catch((error) => {
      console.error("Ошибка при обновлении данных профиля:", error);
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
      deleteCardCallback,
        openImagePopupCallback,
        handleCardLikeCallback,
        currentUserId;
      cards.forEach((card) => {
        // Проверяем, является ли текущий пользователь владельцем карточки
        const isOwner = card.owner._id === currentUserId;
        // Создаем карточку, передавая флаг isOwner
        const cardElement = createCard(
          card,
          deleteCardCallback,
          openImagePopupCallback,
          handleCardLikeCallback,
          isOwner,
          currentUserId
        );

				const likeButton = cardElement.querySelector(".card__like-button");

        // Проверяем, есть ли лайк от текущего пользователя
        const currentUserLiked = card.likes.find((like) => like._id === currentUserId);

        if (currentUserLiked) {
          likeButton.classList.add("card__like-button_is-active");
        }

        // Установим статус лайка в соответствии с текущим пользователем
        const likeCounter = cardElement.querySelector(".card__like-counter");
        likeCounter.textContent = card.likes.length;
				
        // Добавляем карточку в DOM
        cardContainer.append(cardElement);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
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

const modalTriggerElement = document.getElementById("modalTriggerAddButton");
const addNewPlaceFormElement = document.getElementById("popupAddFormId");

modalTriggerElement.addEventListener("click", function () {
  clearValidation(addNewPlaceFormElement, validationConfig);
  toggleButtonState(
    addNewPlaceFormElement,
    Array.from(addNewPlaceFormElement.querySelectorAll(".popup__input")),
    addNewPlaceFormElement.querySelector(".popup__button"),
    validationConfig
  );
});

// Обработчик события submit формы добавления карточки
addCardForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  // Получаем значения из формы
  const placeNameInput = addCardForm.elements.placeName;
  const linkInput = addCardForm.elements.link;

  // Вызываем функцию для добавления новой карточки на сервер
  addCard(placeNameInput.value, linkInput.value)
    .then((newCard) => {
      // Создаем новую карточку на основе данных, полученных с сервера
      const cardElement = createCard(
        newCard,
        deleteCardCallback,
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
    .catch((error) => {
      console.error("Error adding card:", error);
    });
});

// Загрузка информации о пользователе и начальных карточек и обновление элементов на странице
const userNameElement = document.querySelector(".profile__title");
const userAboutElement = document.querySelector(".profile__description");
const userAvatarElement = document.querySelector(".profile__image");

updateAvatarButton.addEventListener("click", () => {
  const newAvatarUrl = avatarLinkInput.value;
  console.log("Avatar URL to be sent:", newAvatarUrl);
  updateAvatar({ avatar: newAvatarUrl })
    .then((data) => {
      console.log("Аватар успешно обновлен", data);
      closeModal(avatarPopup);
    })
    .catch((error) => {
      console.error("Ошибка при обновлении аватара", error);
    });
});
