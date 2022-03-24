const routerFilials = app => {
    app.use(require('./get-filials-id'));
    app.use(require('./get-filials'));
    app.use(require('./post-filials'));
    app.use(require('./delete-filials'));
}

module.exports = routerFilials;