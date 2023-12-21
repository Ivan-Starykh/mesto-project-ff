document.addEventListener("DOMContentLoaded", function() {
  const cardContainer = document.querySelector('.places__list');
  const cardTemplate = document.querySelector('#card-template').content;

  function createCardInfo(initialCards) {
    return initialCards;
  }

  function addCard(cardInfo, deleteCardCallback) {
    for (let card of cardInfo) {
      const cardElement = createCard(card, deleteCardCallback);
      cardContainer.append(cardElement);
    }
  }

  function createCard(card, deleteCardCallback) {
    const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
    cardElement.querySelector('.card__title').textContent = card.name;
    cardElement.querySelector('.card__image').src = card.link;
    cardElement.querySelector('.card__image').setAttribute('alt', card.name);
    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', () => deleteCardCallback(card));
    return cardElement;
  }

  function сardDelete(card) {
    const cardElements = cardContainer.querySelectorAll('.card__title');
    for (let cardElement of cardElements) {
      if (cardElement.textContent === card.name) {
        cardContainer.removeChild(cardElement.closest('.places__item'));
        break;
      }
    }
  }

  const cardInfo = createCardInfo(initialCards);
  addCard(cardInfo, сardDelete);
});