import storage from "../storage";

async function setRole(role) {
	storage.setItem("role", role);
}

async function getRole() {
	return storage.getItem("role");
}

export default {
	setRole,
	getRole
}