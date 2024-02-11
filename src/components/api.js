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

	function deleteCard(cardId) {
		return fetch(`${apiUrl}/cards/${cardId}`, {
			method: 'DELETE',
			headers: {
				authorization: token,
			},
		})
		.then(response => {
			if (!response.ok) {
				return Promise.reject(`Error: ${response.status}`);
			}
		});
	}

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

	

	// Другие запросы по аналогии
	
	export { getCards, updateUserInfoApi, addCard, deleteCard, handleLike  };


	// {name: 'Иван Николаевич', 
	// about: 'Яндекс Практикум', 
	// avatar: 'https://pictures.s3.yandex.net/frontend-developer/common/ava.jpg', 
	// _id: 'c5e7b998f871f8fa8c4bb293', 
	// cohort: 'wff-cohort-6'}
