import makeRequest from '../makeRequest';

export const getPlayers = (params) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/players",
		method: 'GET',
		params
	})
}

export const getPlayersId = (id) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/players/" + id,
		method: 'GET',
	})
}

export const putPlayers = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/players",
		method: 'PUT',
		headers: {'Content-Type': 'multipart/form-data'},
		data
	})
}

export const getOffline = (params) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + "/players-offline",
		method: 'GET',
		params,
	})
}