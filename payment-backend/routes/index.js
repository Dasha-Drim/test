const routerIndex = app => {
    app.use("/v1", require('./api'));
    app.use(require('./methods/paykassaPro/paykassa-api'));
    app.use(require('./methods/interkassa/interkassa-api'));
}

module.exports = routerIndex;