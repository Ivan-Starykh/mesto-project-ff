document.addEventListener("DOMContentLoaded", function() {
  const cardContainer = document.querySelector('.places__list');
  const cardTemplate = document.querySelector('#card-template').content;

  addCards(initialCards, сardDelete);
  
  function addCards(cardInfo, deleteCardCallback) {
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
    deleteButton.addEventListener('click', () => deleteCardCallback(cardElement));
    return cardElement;
  }

	function сardDelete(card) {
    card.remove()
}
});