let config = {
	backend: "http://localhost:3001",
	backendPayment: "http://localhost:3002",
	frontend: "http://localhost:3000",
	dbURL: "mongodb://admingod:STKgod12345@localhost:27017/jenis-prod?authSource=admin",
	lottoMachineIP1: "techsoft.digital",
	lottoMachinePort1: 63245,
	server: null
}

let updateServer = (server) => {
	config.server = server;
}

module.exports.updateServer = updateServer;
module.exports.config = config;