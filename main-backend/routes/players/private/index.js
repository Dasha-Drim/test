const routerPlayersPrivate = app => {
    app.use(require('./balance'));
    app.use(require('./passport'));
    app.use(require('./operations'));
}

module.exports = routerPlayersPrivate;