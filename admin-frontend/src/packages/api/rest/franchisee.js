import makeRequest from '../makeRequest';

export const get = () => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/franchisee",
		method: 'GET'
	})
}

export const getId = (id) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/franchisee/" + id,
		method: 'GET'
	})
}

export const add = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/franchisee",
		method: 'POST',
		data
	})
}

export const remove = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/franchisee",
		method: 'DELETE',
		data
	})
}

export const doc = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/franchisee/doc",
		method: 'POST',
		data
	})
}