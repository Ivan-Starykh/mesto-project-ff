// в файле card.js описаны функции для
// работы с карточками: функция создания
// карточки, функции-обработчики событий
// удаления и лайка карточки;

const cardTemplate = document.querySelector("#card-template").content;

export function createCard(card, deleteCardCallback, openImagePopupCallback) {
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
  likeButton.addEventListener("click", function () {
    this.classList.toggle("card__like-button_is-active");
  });

  cardImage.addEventListener("click", () =>
    openImagePopupCallback(card.link, card.name)
  );

  return cardElement;
}

export function сardDelete(card) {
  card.remove();
}
