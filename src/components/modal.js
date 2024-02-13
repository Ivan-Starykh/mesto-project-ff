// в файле modal.js описаны функции для
// работы с модальными окнами: функция
// открытия модального окна, функция
// закрытия модального окна, функция-обработчик
// события нажатия Esc и функция-обработчик
//  события клика по оверлею;
// Функция для открытия модального окна

import { getUserProfile } from './api.js';
// import { clearValidation } from './index.js';

export function openModal(modal, editForm) {
  modal.classList.add("popup_is-opened");
	// Очистка полей ввода при открытии модального окна
  // clearValidation(editForm, validationConfig);
	  // Загрузка информации о пользователе при открытии профильной формы
		if (modal.classList.contains('popup_type_edit')&& editForm) {
			getUserProfile()
				.then(userInfo => {
					fillProfileForm(editForm, userInfo);
				})
				.catch(error => {
					console.error('Error loading user profile:', error);
				});
		}
  document.addEventListener("keydown", handleModalEscPress);
}

export function closeModal(modal) {
  modal.classList.remove("popup_is-opened");
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
  // nameInput.value = userInfo.name;
  // aboutInput.value = userInfo.about;

  // Другие поля формы, если они есть
}



