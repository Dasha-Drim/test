import axios from 'axios';
import config, { errorHandler } from './config';

axios.defaults.withCredentials = true;

export default ({
	url = '/',
	method = 'get',
	params = {},
	data = {},
	headers = {}
}) => {
	if(headers && headers.authorization) {
		headers.authorization = config.token;
	}
	return axios({
		url,
		method,
		headers,
		params,
		data
	}).catch((error) => {
		errorHandler(error, {url, method, headers, params, data});
		throw error;
	})
}