const routerUsers = app => {
    app.use(require('./get-users'));
    app.use(require('./auth-players'));
    app.use(require('./registration-players'));
    app.use(require('./auth-admins'));
    app.use(require('./offline-users'));
    app.use(require('./visitors'));
    app.use(require('./reset'));
}

module.exports = routerUsers;