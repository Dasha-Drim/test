const routerOperators = app => {
    app.use(require('./get-operators'));
    app.use(require('./post-operators'));
    app.use(require('./delete-operators'));
}

module.exports = routerOperators;