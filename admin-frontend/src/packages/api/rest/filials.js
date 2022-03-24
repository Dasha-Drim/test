import makeRequest from '../makeRequest';

export const get = () => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + "/filials",
		method: 'GET'
	})
}

export const getId = (id) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + "/filials/" + id,
		method: 'GET'
	})
}

export const add = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + "/filials",
		method: 'POST',
		data
	})
}

export const remove = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + "/filials",
		method: 'DELETE',
		data
	})
}