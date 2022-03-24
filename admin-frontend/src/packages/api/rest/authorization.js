import makeRequest from '../makeRequest';

export const login = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3001' + '/auth/admins',
		method: 'POST',
		data
	})
}
