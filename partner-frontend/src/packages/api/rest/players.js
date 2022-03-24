import makeRequest from '../makeRequest';

export const add = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + "/players-offline",
		method: 'POST',
		data
	})
}

export const getId = (id) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + "/players-offline/" + id,
		method: 'GET',
	})
}

export const get = (params) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + "/players-offline",
		method: 'GET',
		params,
	})
}

export const put = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + "/players-offline",
		method: 'PUT',
		headers: {'Content-Type': 'multipart/form-data'},
		data
	})
}