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
				authorization: token
			}
		})
		.then(res => res.json());
	};
	
	const getUserInfo = () => {
		return fetch(`https://nomoreparties.co/v1/:wff-cohort-6/users/me`, {
			headers: {
				authorization: token
			}
		})
		.then(res => res.json());
	};
	
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
	// Другие запросы по аналогии
	
	export { getCards, getUserInfo, updateUserInfoApi, addCard };



