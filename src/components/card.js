// в файле card.js описаны функции для
// работы с карточками: функция создания
// карточки, функции-обработчики событий
// удаления и лайка карточки;
import { handleLike } from './api';
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

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => deleteCardCallback(cardElement));

	

  const likeButton = cardElement.querySelector(".card__like-button");
  likeButton.addEventListener("click", () =>
    handleCardLikeCallback(card, card._id, likeButton)
  );
	// Код для отображения количества лайков
  const likeCounter = cardElement.querySelector(".card__like-counter");
  likeCounter.textContent = card.likes.length; // Устанавливаем количество лайков

  cardImage.addEventListener("click", () =>
    openImagePopupCallback(card.link, card.name)
  );

  return cardElement;
}

export function сardDelete(card) {
  card.remove();
}

export function handleCardLikeCallback(card, cardId, likeButton) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  handleLike(cardId, !isLiked)
    .then(updatedCard => {
      card.likes = updatedCard.likes;

      // Обновите визуальное представление
      likeButton.classList.toggle("card__like-button_is-active");

      // Обновите количество лайков в соответствующем элементе
      const likeCounter = likeButton.closest(".card").querySelector(".card__like-counter");
      likeCounter.textContent = isLiked ? parseInt(likeCounter.textContent) - 1 : parseInt(likeCounter.textContent) + 1;
		})
    .catch(error => console.error(`Error handling like: ${error.message}`));
}
