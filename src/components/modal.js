// в файле modal.js описаны функции для
// работы с модальными окнами: функция
// открытия модального окна, функция
// закрытия модального окна, функция-обработчик
// события нажатия Esc и функция-обработчик
//  события клика по оверлею;
// Функция для открытия модального окна

export function openModal(modal) {
  modal.classList.add("popup_is-opened");
  modal.addEventListener("click", handleModalOverlayClick);
  document.addEventListener("keydown", handleModalEscPress);
}

export function closeModal(modal) {
  modal.classList.remove("popup_is-opened");

  modal.removeEventListener("click", handleModalOverlayClick);
  document.removeEventListener("keydown", handleModalEscPress);
}

export function handleModalOverlayClick(event) {
  if (event.target === event.currentTarget) {
    const modal = event.target.closest(".popup");
    closeModal(modal);
  }
}

export function handleModalEscPress(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".popup_is-opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}
