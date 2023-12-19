// @todo: Темплейт карточки
// @todo: DOM узлы

const cardContainer = document.querySelector(`.places__list`);
const cardTemplate = document.querySelector(`#card-template`).content;

// @todo: Функция создания карточки
// @todo: Вывести карточки на страницу

const cardInfo = initialCards.map(function (item) {
  return {
    name: item.name,
    link: item.link,
  };
});

function render() {
  cardInfo.forEach(renderCard);
}

function renderCard({ name, link }) {
  const cardElement = cardTemplate
    .querySelector(`.places__item`)
    .cloneNode(true);
  cardElement.querySelector(`.card__title`).textContent = name;
  cardElement.querySelector(`.card__image`).src = link;

  cardContainer.append(cardElement);
}

render();

// @todo: Функция удаления карточки

function deleteCard(event) {
  const card = event.target.closest(`.card`);

  if (card) {
    card.remove();
  }
}

document.addEventListener(`DOMContentLoaded`, () => {
  const bins = document.querySelectorAll(".card__delete-button");

  for (const bin of bins) {
    bin.addEventListener(`click`, deleteCard);
  }
});
