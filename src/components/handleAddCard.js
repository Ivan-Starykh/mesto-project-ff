import { addCard } from "./api.js";
import {
  placeNameInput,
  linkInput,
  addCardToDOM,
  cardContainer,
} from "./index.js";

export function handleAddCard() {
  // Вызываем функцию для добавления новой карточки на сервер
  addCard(placeNameInput.value, linkInput.value)
    .then((newCard) => {
      // Добавляем новую карточку в DOM
      addCardToDOM(newCard, cardContainer);
    })
    .catch((error) => {
      console.error("Error adding card:", error);
    });
}
