let config = {
	backend: "https://"+ document.domain +":3001",
	frontend: "https://"+ document.domain+(window.location.port ? ":"+window.location.port : ""),
	interkassa: {
		kassaID: "61362b343d68a54de902518a"
	}
}
let configProd = {
	backend: "https://"+ document.domain +":3067",
	frontend: "https://"+ document.domain+(window.location.port ? ":"+window.location.port : ""),
	interkassa: {
		kassaID: "61362b343d68a54de902518a"
	}
}
// Attention: games config in utils/ENVIRONMENT.js

//module.exports = configProd;
module.exports = config;
