import makeRequest from '../makeRequest';

export const get = (params) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/payments",
		method: 'GET',
		params
	})
}

export const balance = () => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/methods",
		method: 'GET',
	})
}

export const postConfirm = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/withdraw/confirmation",
		method: 'POST',
		data,
	})
}

export const postUnconfirm = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/withdraw/unconfirmation",
		method: 'POST',
		data,
	})
}