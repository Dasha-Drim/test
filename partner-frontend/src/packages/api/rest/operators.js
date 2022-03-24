import makeRequest from '../makeRequest';


export const add = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + "/operators",
		method: 'POST',
		data
	})
}

export const remove = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + "/operators",
		method: 'DELETE',
		data
	})
}