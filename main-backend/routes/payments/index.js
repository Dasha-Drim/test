const routerIndex = app => {
    app.use(require('./methods/get-methods'));
    app.use(require('./get-payments'));
    app.use(require('./post-payments'));
    app.use(require('./get-payments-id'));

    app.use(require('./success'));
    app.use(require('./error'));
    app.use(require('./result'));

    app.use(require('./statistic'));

    app.use(require('./post-withdraw'));
    app.use(require('./post-withdraw-confirmation'));
    app.use(require('./post-withdraw-unconfirmation'));
}

module.exports = routerIndex;