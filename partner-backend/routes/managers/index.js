const routerManagers = app => {
    app.use(require('./get-managers'));
    app.use(require('./update-managers'));
    app.use(require('./post-managers'));
    app.use(require('./delete-managers'));
}

module.exports = routerManagers;