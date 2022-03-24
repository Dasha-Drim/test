const jsonwebtoken = require('jsonwebtoken');

function issueJWT(user, res, browser, role) {
	let _id = user;
	let expiresIn = 10*60*1000; //10 минут
	let IDbrowser = browser;

	let payload = {
		sub: _id,
		iat: Date.now(),
		expiresIn: expiresIn,
		IDbrowser: IDbrowser,
		role: role
	};
	console.log("payload", payload);
	let signedToken = jsonwebtoken.sign(payload, '1234564sgggdvsdg', { expiresIn: expiresIn });
	console.log("signedToken", signedToken);
	res.cookie('token', signedToken, { maxAge: expiresIn});

	return {
		token: signedToken,
		expires: expiresIn
	}
}

function updateJWT(token, res, browser, position='') {
	let doc = jsonwebtoken.decode(token);

	if (!doc) return false;
	
	if (doc.IDbrowser !== browser) {
		res.clearCookie('token');
		return false;
	}

	let role;
	let _id = doc.sub;
	let expiresIn = 40*24*60*60*1000; // 40 дней
	let IDbrowser = browser;
	if (position == '') { role = doc.role; } else { role = position;}

	let payload = {
		sub: _id,
		iat: Date.now(),
		IDbrowser: IDbrowser,
		role: role,
	};

	let newToken = jsonwebtoken.sign(payload, '1234564sgggdvsdg', { expiresIn: expiresIn });

	res.cookie('token', newToken, { maxAge: expiresIn })
	return {id: payload.sub, role: role};
}


function decodeToken(token) {
	let doc = jsonwebtoken.decode(token);
	return {id: doc.sub, role: doc.role};
}

function ioUpdateJWT(token, browser) {
	let doc = jsonwebtoken.decode(token);
	let _id = doc.sub;
	let expiresIn = 40*24*60*60*1000; // 40 дней
	let IDbrowser = browser;
	let role = doc.role;

	let payload = {
		sub: _id,
		iat: Date.now(),
		IDbrowser: IDbrowser,
		role: role,
	};
	let newToken = jsonwebtoken.sign(payload, '1234564sgggdvsdg', { expiresIn: expiresIn });

	return {id: payload.sub, role: role};
}

module.exports.issueJWT = issueJWT;
module.exports.updateJWT = updateJWT;
module.exports.ioUpdateJWT = ioUpdateJWT;
module.exports.decodeToken = decodeToken;