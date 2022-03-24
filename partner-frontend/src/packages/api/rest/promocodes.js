import makeRequest from '../makeRequest';

export const get = () => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/promocodes",
		method: 'GET'
	})
}

export const add = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/promocodes",
		method: 'POST',
		data
	})
}

export const remove = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/promocodes",
		method: 'DELETE',
		data
	})
}