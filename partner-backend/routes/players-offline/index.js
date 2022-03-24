const routerPlayersOffline = app => {
    app.use(require('./get-players-offline'));
    app.use(require('./put-players-offline'));
    app.use(require('./post-players-offline'));
    app.use(require('./get-players-offline-id'));
}

module.exports = routerPlayersOffline;