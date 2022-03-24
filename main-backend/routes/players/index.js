const routerPlayers = app => {
    app.use(require('./put-players'));
    app.use(require('./get-players'));
    app.use(require('./get-players-id'));
}

module.exports = routerPlayers;