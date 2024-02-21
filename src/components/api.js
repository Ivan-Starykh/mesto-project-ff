const cohortId = "wff-cohort-6";
const token = "abc1f6c4-1bf9-4e36-8508-5e54153145a1";
const apiUrl = `https://nomoreparties.co/v1/${cohortId}`;

const checkResponse = (response) => {
  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }
  return response.json();
};

const getCards = () => {
  return fetch(`${apiUrl}/cards`, {
    headers: {
      authorization: token,
    },
  })
    .then(checkResponse)
    .then((data) => {
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid cards data received from the server.");
      }
      return data;
    });
};

export function getUserProfile() {
  return fetch(`${apiUrl}/users/me`, {
    method: "GET",
    headers: {
      authorization: token,
    },
  }).then(checkResponse);
}

const updateUserInfoApi = (name, about) => {
  return fetch(`${apiUrl}/users/me`, {
    method: "PATCH",
    headers: {
      authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      about: about,
    }),
  }).then(checkResponse);
};

const addCard = (name, link) => {
  return fetch(`${apiUrl}/cards`, {
    method: "POST",
    headers: {
      authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      link: link,
    }),
  }).then(checkResponse);
};

const handleLike = (cardId, isLiked) => {
  const method = isLiked ? "DELETE" : "PUT";
  return fetch(`${apiUrl}/cards/likes/${cardId}`, {
    method,
    headers: {
      authorization: token,
    },
  })
    .then(checkResponse)
    .then((updatedCard) => {
      return updatedCard;
    })
    .catch((error) => {
      console.error("Error handling like:", error);
      throw error;
    });
};

async function checkImageValidity(url) {
  if (!url.trim()) {
    return false;
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function () {
      // Изображение успешно загружено, считаем его валидным
      resolve(true);
    };
    img.onerror = function () {
      // Изображение не загрузилось, считаем его недействительным
      resolve(false);
    };
    img.src = url;
  });
}

const updateAvatar = (avatar) => {
  const avatarData = { avatar: avatar.avatar };
  return fetch(`${apiUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    body: JSON.stringify(avatarData),
  })
    .then(checkResponse)
    .then((data) => {
      console.log("Avatar update response data:", data);
    });
};

// Функция удаления карточки
function deleteCard(cardId) {
  const url = `${apiUrl}/cards/${cardId}`;
  console.log("DELETE request to:", url);

  return fetch(url, {
    method: "DELETE",
    headers: {
      authorization: token,
    },
  }).then(checkResponse);
}

export {
  getCards,
  updateUserInfoApi,
  addCard,
  deleteCard,
  handleLike,
  checkImageValidity,
  updateAvatar,
};
