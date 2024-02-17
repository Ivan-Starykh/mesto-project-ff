// в файле modal.js описаны функции для
// работы с модальными окнами: функция
// открытия модального окна, функция
// закрытия модального окна, функция-обработчик
// события нажатия Esc и функция-обработчик
//  события клика по оверлею;
// Функция для открытия модального окна

import { getUserProfile } from './api.js';
import { resetFormInputs, resetErrorMessages } from './index.js';

export function openModal(modal) {
  modal.classList.add("popup_is-opened");
  document.addEventListener("keydown", handleModalEscPress);
}

export function closeModal(modal) {
  if (modal) {
    modal.classList.remove("popup_is-opened");
    document.removeEventListener("keydown", handleModalEscPress);
  }
}

export function handleModalOverlayClick(event) {
  if (event.target === event.currentTarget) {
    const modal = event.target.closest(".popup");
		if (openModal) {
			closeModal(modal);
  }
}}

export function handleModalEscPress(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".popup_is-opened");
    if (openModal) {
			closeModal(openModal);
    }
  }
}

export function setModalClickListener(modal, handleModalOverlayClick) {
  modal.addEventListener("click", handleModalOverlayClick);
}

// Функция для заполнения формы профиля
export function fillProfileForm(editForm, userInfo) {
  const nameInput = editForm.elements.name;
  const aboutInput = editForm.elements.description;
	if (userInfo && userInfo.name) {
    nameInput.value = userInfo.name;
  }

  if (userInfo && userInfo.about) {
    aboutInput.value = userInfo.about;
  }

  // Другие поля формы, если они есть
}