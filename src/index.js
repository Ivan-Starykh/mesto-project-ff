// в файле index.js описана инициализация 
// приложения и основная логика страницы: 
// поиск DOM-элементов на странице и навешивание 
// на них обработчиков событий; обработчики 
// отправки форм, функция-обработчик события 
// открытия модального окна для редактирования 
// профиля; функция открытия модального окна изображения 
// карточки. Также в index.js находится код, который 
// отвечает за отображение шести карточек при открытии страницы.

import '../src/pages/index.css';
import {initialCards} from './components/cards.js';
// import {...} from './components/card.js';
// import {...} from './components/modal.js';

document.addEventListener("DOMContentLoaded", function() {
	const cardContainer = document.querySelector('.places__list');
  const cardTemplate = document.querySelector('#card-template').content;
	
	// Редактируем профиль
	const editPopup = document.querySelector('.popup_type_edit');
	const editForm = document.forms.editProfile;
	const nameInput = editForm.elements.name;
	const aboutInput = editForm.elements.description;

	const userCard = document.querySelector('.profile__info');
    const userName = userCard.querySelector('.profile__title');
    const userAbout = userCard.querySelector('.profile__description');
    const editProfileButton = userCard.querySelector('.profile__edit-button');

    let initialName;
    let initialAbout;

			editProfileButton.addEventListener('click', function() {
				// Получаем значения из элементов профиля
				const currentName = userName.textContent;
				const currentAbout = userAbout.textContent;
			
				initialName = userName.textContent;
        initialAbout = userAbout.textContent;
				// Заполняем поля модальной формы
				nameInput.value = currentName;
				aboutInput.value = currentAbout;
			
				// Открываем модальное окно
				openModal(editPopup);
			});

			// Функция для обновления информации на странице
			function updateUserInfo() {
        userName.textContent = nameInput.value;
        userAbout.textContent = aboutInput.value;
        closeEditPopup();
    }

		    // Функция для закрытия модального окна редактирования
				function closeEditPopup() {
					nameInput.value = initialName;
					aboutInput.value = initialAbout;
					    // Добавляем класс для анимации закрытия
					editPopup.classList.add('popup_is-animated');
					// closeModal();
			

			window.addEventListener('keydown', function (evt) {
        if (evt.key === 'Escape') {
            closeEditPopup();
        }
				});
			}

				// Обработчик события submit формы
				editForm.addEventListener('submit', function (evt) {
					evt.preventDefault();
					updateUserInfo();
					if (evt.target === evt.currentTarget) {
						const modal = evt.target.closest('.popup');
						closeModal(modal);
					}
				});

	// Получаем элементы модальных окон
	const editModal = document.querySelector('.popup_type_edit');
	const addModal = document.querySelector('.popup_type_new-card');
	const imageModal = document.querySelector('popup__content_content_image');

	// Получаем кнопки, которые открывают модальные окна
	const editButton = document.querySelector('.profile__edit-button');
	const addButton = document.querySelector('.profile__add-button');
	const imageButton = document.querySelector('.card__image');

	// Получаем элементы для закрытия модальных окон
	const closeButtons = document.querySelectorAll('.popup__close');
	


  addCards(initialCards, сardDelete, openImagePopup);
  
  function addCards(cardInfo, deleteCardCallback, openImagePopupCallback) {
    for (let card of cardInfo) {
      const cardElement = createCard(card, deleteCardCallback, openImagePopupCallback);
      cardContainer.append(cardElement);
    }
  }

  function createCard(card, deleteCardCallback, openImagePopupCallback) {
    const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
    cardElement.querySelector('.card__title').textContent = card.name;
    cardElement.querySelector('.card__image').src = card.link;
		const cardImage = cardElement.querySelector('.card__image');
		cardImage.src = card.link;
		cardImage.setAttribute('alt', card.name);
		const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', () => deleteCardCallback(cardElement));
    
		// Добавляем обработчик события для открытия попапа с изображением
		cardImage.addEventListener('click', () => openImagePopupCallback(card.link, card.name));

		
		return cardElement;
  }

	function сardDelete(card) {
    card.remove()
};

function openImagePopup(imageUrl, imageName) {
  const imagePopup = document.querySelector('.popup_type_image');
  const image = imagePopup.querySelector('.popup__image');
  const imageCaption = imagePopup.querySelector('.popup__caption');

  image.src = imageUrl;
  image.alt = imageName;
  imageCaption.textContent = imageName;

  openModal(imagePopup);
}



// спринт 6


// Функция для закрытия модального окна
function closeModal(modal) {
  modal.classList.remove('popup_is-opened');
  // modal.classList.toggle('popup_is-animated');

  // Удаляем обработчик событий для закрытия модального окна при клике на оверлей
  modal.removeEventListener('click', handleModalOverlayClick);
  
  // Удаляем обработчик событий для закрытия модального окна при нажатии на клавишу Esc
  document.removeEventListener('keydown', handleModalEscPress);
}

// Функция-обработчик для закрытия модального окна при клике на оверлей
function handleModalOverlayClick(event) {
  if (event.target === event.currentTarget) {
    const modal = event.target.closest('.popup');
    closeModal(modal);
  }
}

// Функция-обработчик для закрытия модального окна при нажатии на клавишу Esc
function handleModalEscPress(event) {
  if (event.key === 'Escape') {
    const openModal = document.querySelector('.popup_is-opened');
    if (openModal) {
      closeModal(openModal);
    }
  }
}

// Добавляем обработчики событий для кнопок открытия модальных окон
editButton.addEventListener('click', function() {
  openModal(editModal);
});

addButton.addEventListener('click', function() {
  openModal(addModal);
});

// imageButton.addEventListener('click', function() {
  // openModal(imageModal);
// });

function openModal(modal) {
  modal.classList.add('popup_is-opened');
	modal.addEventListener('click', handleModalOverlayClick);
	document.addEventListener('keydown', handleModalEscPress);
}

// Добавляем обработчики событий для кнопок закрытия модальных окон
closeButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    const modal = button.closest('.popup');
		modal.classList.add('popup_is-animated');
		closeModal(modal);
  });
});



// Получаем все кнопки лайка
  const likeButtons = document.querySelectorAll('.card__like-button');

 // Добавляем обработчик события для каждой кнопки лайка
  likeButtons.forEach(function (likeButton) {
		likeButton.addEventListener('click', function () {
				this.classList.toggle('card__like-button_is-active');
		});
});

// добавляем пользовательскую карточку



// // const addCardButton = document.querySelector('.profile__add-button');
// // const addCardModal = document.querySelector('.popup_type_new-card');
// const addCardForm = document.forms.new-place;
// // const cardContainer = document.querySelector('.places__list');

// // Обработчик события submit формы добавления карточки
// addCardForm.addEventListener('submit', function (evt) {
// 	evt.preventDefault();

// 	const placeNameInput = addCardForm.elements.placeName;
// 	const linkInput = addCardForm.elements.link;

// 	const newCardData = {
// 		placeName: placeNameInput.value,
// 		link: linkInput.value
// 	};
//     // Создаем новую карточку
//     const newCard = createCard(newCardData);

// // Добавляем новую карточку в начало контейнера
// cardContainer.prepend(newCard);

// // Функция для закрытия модального окна добавления карточки
// function closeAddCardModal() {
// 	closeModal(addModal);
// 	addCardForm.reset();
// }

// // Закрываем и очищаем форму
// closeAddCardModal();
// });







});
