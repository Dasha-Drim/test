import storage from "../storage";

async function setToken(token) {
	storage.setItem("token", token);
}

async function getToken() {
	return storage.getItem("token");
}

export default {
	setToken,
	getToken
}