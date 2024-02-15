const cohortId = 'wff-cohort-6';
const token = 'abc1f6c4-1bf9-4e36-8508-5e54153145a1';
const apiUrl = `https://nomoreparties.co/v1/${cohortId}`;

fetch(`https://nomoreparties.co/v1/${cohortId}/cards`, {
  headers: {
    authorization: token
  }
})
  .then(res => res.json())
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error('Error:', error);
  });

	const getCards = () => {
		return fetch(`${apiUrl}/cards`, {
			headers: {
				authorization: token,
			},
		})
			.then(res => {
				if (!res.ok) {
					throw new Error(`Error: ${res.status}`);
				}
				return res.json();
			})
			.then(data => {
				if (!data || !Array.isArray(data)) {
					throw new Error('Invalid cards data received from the server.');
				}
				return data;
			});
	};
	

	export function getUserProfile() {
		return fetch(`${apiUrl}/users/me`, {
			method: 'GET',
			headers: {
				authorization: token,
			},
		})
		.then(response => {
			if (!response.ok) {
				return Promise.reject(`Error: ${response.status}`);
			}
			return response.json();
		});
	}
	
	const updateUserInfoApi = (name, about) => {
		return fetch(`${apiUrl}/users/me`, {
			method: 'PATCH',
			headers: {
				authorization: token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				about: about
			})
		})
		.then(res => res.json());
	};

	const addCard = (name, link) => {
		return fetch(`${apiUrl}/cards`, {
			method: 'POST',
			headers: {
				authorization: token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				link: link
			})
		})
		.then(res => res.json());
	};
	

	const handleLike = (cardId, isLiked) => {
		const method = isLiked ? 'DELETE' : 'PUT';
		return fetch(`${apiUrl}/cards/likes/${cardId}`, {
			method,
			headers: {
				authorization: token,
			},
		})
			.then(response => {
				if (!response.ok) {
					return Promise.reject(`Error: ${response.status}`);
				}
				return response.json();
			});
	};

	async function checkImageValidity(url) {
		if (!url.trim()) {
			return false;
	}
		return new Promise(resolve => {
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
		return fetch(`https://nomoreparties.co/v1/wff-cohort-6/users/me/avatar`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				authorization: token,
			},
			body: JSON.stringify(avatarData),
			})
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Ошибка: ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			console.log('Avatar update response data:', data);
		      // Обновляем элемент DOM с изображением аватара
					const userAvatarElement = document.querySelector('.profile__image');
					if (userAvatarElement) {
						userAvatarElement.style.backgroundImage = `url(${data.avatar})`;
					}
				})
		.catch((error) => {
			console.error('Ошибка при обновлении аватара:', error);
			throw error; // Переписываем ошибку для дальнейшей обработки
		});
	};
	
	// Функция удаления карточки
	function deleteCard(cardId) {
    const url = `${apiUrl}/cards/${cardId}`;
    console.log('DELETE request to:', url);

    return fetch(url, {
        method: 'DELETE',
        headers: {
            authorization: token
        }
    })
    .then(function(response) {
        console.log('Response status:', response.status);

        if (!response.ok) {
					return response.json().then(error => {
						throw new Error(`Ошибка: ${response.status}, ${error.message}`);
				});
        //     throw new Error(`Ошибка: ${response.status}`);
        }
    })
    .catch(function(error) {
        console.error('Ошибка при удалении карточки:', error);
    });
}

	// Другие запросы по аналогии
	
	export { getCards, updateUserInfoApi, addCard, deleteCard, handleLike, checkImageValidity, updateAvatar, };
