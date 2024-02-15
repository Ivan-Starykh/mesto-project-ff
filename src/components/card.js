// в файле card.js описаны функции для
// работы с карточками: функция создания
// карточки, функции-обработчики событий
// удаления и лайка карточки;
import { handleLike, addCard, deleteCard } from './api';

const cardTemplate = document.querySelector("#card-template").content;

export function createCard(
  card,
  deleteCardCallback,
  openImagePopupCallback,
  handleCardLikeCallback,
	isOwner
) {
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);

  cardElement.querySelector(".card__title").textContent = card.name;
  cardElement.querySelector(".card__image").src = card.link;
  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = card.link;
  cardImage.setAttribute("alt", card.name);

// Сохраняем _id карточки в data-атрибуте
cardElement.dataset.cardId = card._id;
const cardId = card._id;

  const deleteButton = cardElement.querySelector(".card__delete-button");
	if (deleteButton) {
	if (isOwner) {
    deleteButton.style.display = "block";
		deleteButton.addEventListener("click", () => deleteCardCallback(cardId, cardElement));
  } else {
    deleteButton.style.display = "none";
  }
} else {
	console.error("Delete button not found for the card");
}

  const likeButton = cardElement.querySelector(".card__like-button");

  likeButton.addEventListener("click", () => {
		const isLiked = likeButton.classList.contains("card__like-button_is-active");
  handleCardLikeCallback(card, card._id, likeButton, isLiked);
	});

	// Код для отображения количества лайков
  const likeCounter = cardElement.querySelector(".card__like-counter");
	if (likeCounter && card.likes) {
  likeCounter.textContent = card.likes.length; // Устанавливаем количество лайков
} else {
	console.error("Like counter or likes not found for the card");
}

  cardImage.addEventListener("click", () =>
    openImagePopupCallback(card.link, card.name)
  );

  return cardElement;
}

export function cardDelete(cardElement) {
if (cardElement.parentElement) {
	cardElement.parentElement.removeChild(cardElement);
} else {
	console.error('Parent element not found for the card');
}
	}

	// Получаем информацию о текущем пользователе
	export const currentUserId = "c5e7b998f871f8fa8c4bb293";
	// Функция проверки, является ли пользователь владельцем карточки
	export function isOwner(cardId) {
	  // Находим карточку по идентификатору
const card = findCardById(cardId);
	return card && card.owner._id === currentUserId;
	}
	
	// Определение функции findCardById
	function findCardById(cardId) {
	return cards.find((card) => card._id === cardId) || null;
	}
	
	export function deleteCardCallback(cardId, cardElement) {
	// Вызываем функцию удаления карточки
	deleteCard(cardId)
	.then(() => {
		console.log('Card deleted successfully:', cardId);
	
		      // Если удаление прошло успешно, удаляем карточку из DOM
					if (cardElement) {
						cardDelete(cardElement);
					} else {
						console.error('Card element not found in the DOM');
					}
				})
	.catch(error => {
		console.error('Error deleting card:', error);
	});
	}

// Обработчик события для кнопки удаления
function handleDeleteCard(event) {
  const cardElement = event.target.closest(card);
  const cardId = cardElement.dataset.cardId;

  // Вызываем функцию удаления карточки
  deleteCardCallback(cardId, cardElement);
}


export function handleCardLikeCallback(card, cardId, likeButton, isLiked) {

  handleLike(cardId, isLiked)
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