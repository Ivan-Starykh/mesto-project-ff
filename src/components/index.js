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
} from "./modal.js";

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
  openModal(editPopup);
});

// Функция для обновления информации на странице
function updateUserInfo(modal) {
  userName.textContent = nameInput.value;
  userAbout.textContent = aboutInput.value;
  closeModal(modal);
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
  initialCards,
  сardDelete,
  openImagePopupCallback,
  handleCardLikeCallback
);

function addCards(
  cardInfo,
  deleteCardCallback,
  openImagePopupCallback,
  handleCardLikeCallback
) {
  for (let card of cardInfo) {
    const cardElement = createCard(
      card,
      deleteCardCallback,
      openImagePopupCallback,
      handleCardLikeCallback
    );
    cardContainer.append(cardElement);
  }
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
    // modal.classList.add("popup_is-animated");
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

  // Создаем новую карточку
  const newCardData = {
    name: placeNameInput.value,
    link: linkInput.value,
  };

  const newCard = createCard(
    newCardData,
    сardDelete,
    openImagePopupCallback,
    handleCardLikeCallback
  );

  // Добавляем новую карточку в начало контейнера
  cardContainer.prepend(newCard);

  // Закрываем модальное окно
  closeModal(addModal);

  // Очищаем форму
  addCardForm.reset();
});