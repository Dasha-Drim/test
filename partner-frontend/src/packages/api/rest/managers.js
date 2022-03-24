import makeRequest from '../makeRequest';

export const get = (params) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + "/managers",
		method: 'GET',
		params
	})
}

export const add = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + "/managers",
		method: 'POST',
		data
	})
}

export const update = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + "/managers",
		method: 'PUT',
		data
	})
}


export const remove = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + "/managers",
		method: 'DELETE',
		data
	})
}