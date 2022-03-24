let storage;

function setItem(name, value) {
	storage.setItem(name, value);
}

function getItem(name) {
	return storage.getItem(name);
}

export default {
	setItem,
	getItem
}

export const setStorage = (instance) => {
	storage = instance;
}