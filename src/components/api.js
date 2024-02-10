const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-6',
  headers: {
    authorization: 'abc1f6c4-1bf9-4e36-8508-5e54153145a1',
    'Content-Type': 'application/json'
  }
}

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
			 // если ошибка, отклоняем промис
			return Promise.reject(`Ошибка: ${res.status}`);
    });
} 




