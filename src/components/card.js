import { handleLike, addCard, deleteCard } from "./api.js";
import { getCurrentUserId } from "./index.js";

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

  cardElement.dataset.cardId = card._id;
  const cardId = card._id;

  const deleteButton = cardElement.querySelector(".card__delete-button");
  if (getCurrentUserId().trim() === card.owner._id.trim()) {
    // Если текущий пользователь владелец карточки
    deleteButton.style.display = "block";
    deleteButton.addEventListener("click", function () {
      deleteCardCallback(cardId, cardElement);
    });
  } else {
    deleteButton.style.display = "none";
  }
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-counter");

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains(
      "card__like-button_is-active"
    );
    handleCardLikeCallback(card, card._id, likeButton, isLiked);
  });

  if (likeCounter && card.likes) {
    likeCounter.textContent = card.likes.length;
  } else {
    console.error("Like counter or likes not found for the card");
  }

  // Проверяем, есть ли лайк от текущего пользователя
  const currentUserLiked = card.likes.find(
    (like) => like._id === getCurrentUserId()
  );
  if (currentUserLiked) {
    likeButton.classList.add("card__like-button_is-active");
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
    console.error("Parent element not found for the card");
  }
}

// Функция проверки, является ли пользователь владельцем карточки
export function isOwner(cardId) {
  // Находим карточку по идентификатору
  const card = findCardById(cardId);
  return card && card.owner._id === getCurrentUserId();
}

// Определение функции findCardById
function findCardById(cardId) {
  return cards.find((card) => card._id === cardId) || null;
}

export function deleteCardCallback(cardId, cardElement) {
  // Вызываем функцию удаления карточки
  deleteCard(cardId)
    .then(() => {
      console.log("Card deleted successfully:", cardId);

      // Если удаление прошло успешно, удаляем карточку из DOM
      if (cardElement) {
        cardDelete(cardElement);
      } else {
        console.error("Card element not found in the DOM");
      }
    })
    .catch((error) => {
      console.error("Error deleting card:", error);
    });
}

export function handleCardLikeCallback(card, cardId, likeButton, isLiked) {
  const toggleLike = () => {
    handleLike(cardId, isLiked)
      .then((updatedCard) => {
        card.likes = updatedCard.likes; // Обновляем массив card.likes

        const likeCounter = likeButton
          .closest(".card")
          .querySelector(".card__like-counter");
        if (likeCounter) {
          likeCounter.textContent = card.likes.length;
        }

        const currentUserLiked = card.likes.find(
          (like) => like._id === getCurrentUserId()
        );

        likeButton.classList.toggle(
          "card__like-button_is-active",
          !!currentUserLiked
        );
      })
      .catch((error) => console.error(`Error handling like: ${error.message}`));
  };

  if (isLiked) {
    likeButton.classList.remove("card__like-button_is-active");
  } else {
    likeButton.classList.add("card__like-button_is-active");
  }
  if (isLiked !== undefined) {
    toggleLike();
  }
}
