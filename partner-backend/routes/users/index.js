const routerUsers = app => {
    app.use(require('./get-users'));
    app.use(require('./auth-admins'));
}

module.exports = routerUsers;