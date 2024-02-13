// в файле card.js описаны функции для
// работы с карточками: функция создания
// карточки, функции-обработчики событий
// удаления и лайка карточки;

const cardTemplate = document.querySelector("#card-template").content;

export function createCard(
  card,
  deleteCardCallback,
  openImagePopupCallback,
  handleCardLikeCallback
) {
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);
  cardElement.querySelector(".card__title").textContent = card.name;
  cardElement.querySelector(".card__image").src = card.link;
  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = card.link;
  cardImage.setAttribute("alt", card.name);

	// Код для отображения иконки удаления только на карточках, созданных вами
  const isOwn = card.owner._id === yourUserId; // Подставьте свой ID пользователя
  const deleteButton = cardElement.querySelector(".card__delete-button");
	if (isOwn) {
    deleteButton.style.display = "block"; // Покажите иконку удаления
  } else {
    deleteButton.style.display = "none"; // Скройте иконку удаления
  }
  deleteButton.addEventListener("click", () => deleteCardCallback(card._id, cardElement));

  const likeButton = cardElement.querySelector(".card__like-button");
  likeButton.addEventListener("click", () =>
    handleCardLikeCallback(card._id, likeButton)
  );
	// Код для отображения количества лайков
  const likeCounter = cardElement.querySelector(".card__like-counter");
  likeCounter.textContent = card.likes.length; // Устанавливаем количество лайков

  cardImage.addEventListener("click", () =>
    openImagePopupCallback(card.link, card.name)
  );

  return cardElement;
}

// export function сardDelete(card) {
//   card.remove();
// }
export function сardDelete(cardId, cardElement) {
  const deleteCardPopup = document.querySelector(".popup_type_delete-card");

  // Открытие попапа удаления
  openModal(deleteCardPopup);

  // Обработчик кнопки "Да" в попапе удаления
  const confirmDeleteButton = deleteCardPopup.querySelector(".popup__button_type_confirm");
  confirmDeleteButton.addEventListener("click", () => {
    // Вызываем функцию удаления карточки
    deleteCard(cardId)
      .then(() => {
        // Успешное удаление карточки
        cardElement.remove();
        closeModal(deleteCardPopup);
      })
      .catch(error => {
        console.error('Error deleting card:', error);
      });
  });
}

export function handleCardLikeCallback(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}