// const config = {
//   baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-6',
//   headers: {
//     authorization: 'abc1f6c4-1bf9-4e36-8508-5e54153145a1',
//     'Content-Type': 'application/json'
//   }
// }

// export const getInitialCards = () => {
//   return fetch(`${config.baseUrl}/cards`, {
//     headers: config.headers
//   })
//     .then(res => {
//       if (res.ok) {
//         return res.json();
//       }
// 			 // если ошибка, отклоняем промис
// 			return Promise.reject(`Ошибка: ${res.status}`);
//     });
// } 
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
		return fetch(`${apiUrl}/users/me`, {
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
	// Другие запросы по аналогии
	
	export { getCards, getUserInfo, updateUserInfoApi };



