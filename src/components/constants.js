export const cardContainer = document.querySelector(".places__list");
export const imagePopup = document.querySelector(".popup_type_image");
export const cardImage = imagePopup.querySelector(".popup__image");
export const imageCaption = imagePopup.querySelector(".popup__caption");

// Редактируем профиль
export const editPopup = document.querySelector(".popup_type_edit");
export const editForm = document.forms.editProfile;
export const nameInput = editForm.elements.name;
export const aboutInput = editForm.elements.description;
export const userProfileCard = document.querySelector(".profile__info");
export const userName = userProfileCard.querySelector(".profile__title");
export const userAbout = userProfileCard.querySelector(".profile__description");
export const editProfileButton = userProfileCard.querySelector(
  ".profile__edit-button"
);
export const profileForm = document.querySelector(".popup__form");
export const namePopupInput = profileForm.querySelector(
  ".popup__input_type_name"
);
export const descriptionInput = document.querySelector(
  ".popup__input_type_description"
);
export const placeNameInput = document.querySelector(
  ".popup__input_type_card-name"
);
export const linkInput = document.querySelector(".popup__input_type_url");
export const formElement = document.querySelector(".popup__form");

// Редактируем аватарку
export const editAvatarIcon = document.querySelector(".profile__image");
export const avatarPopup = document.querySelector(".popup_type_edit-avatar");
export const avatarLinkInput = document.getElementById("avatarLink");
export const updateAvatarButton = document.getElementById("SaveAvatarButton");

// Получаем элементы модальных окон
export const editModal = document.querySelector(".popup_type_edit");
export const addModal = document.querySelector(".popup_type_new-card");

// Получаем кнопки, которые открывают модальные окна
export const editButton = document.querySelector(".profile__edit-button");
export const addButton = document.querySelector(".profile__add-button");

// Получаем элементы для закрытия модальных окон
export const closeButtons = document.querySelectorAll(".popup__close");
