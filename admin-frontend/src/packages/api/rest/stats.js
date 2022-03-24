import makeRequest from '../makeRequest';

export const get = () => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/statistic/players",
		method: 'GET'
	})
}

export const country = (params) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/statistic/country",
		method: 'GET',
		params
	})
}

export const visitors = (params) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/statistic/visitors",
		method: 'GET',
		params
	})
}

export const visitorsNew = (params) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/statistic/visitors/new",
		method: 'GET',
		params
	})
}

export const monitoring = () => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + "/monitoring",
		method: 'GET'
	})
}