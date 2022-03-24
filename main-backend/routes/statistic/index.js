const routerStats = app => {
    app.use(require('./players'));
    app.use(require('./country'));
    app.use(require('./visitors'));
    app.use(require('./new-visitors'));
    app.use(require('./monitoring'));
}

module.exports = routerStats;