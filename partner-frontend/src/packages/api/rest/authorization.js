import makeRequest from '../makeRequest';

export const login = (data) => {
	return makeRequest({
		url: 'http://dev.unicrete.ru:3002' + '/auth/admins',
		method: 'POST',
		data
	})
}
