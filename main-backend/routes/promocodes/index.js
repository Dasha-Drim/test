const routerPromocodes = app => {
    app.use(require('./post-promocodes'));
    app.use(require('./delete-promocodes'));
    app.use(require('./get-promocodes'));
}

module.exports = routerPromocodes;