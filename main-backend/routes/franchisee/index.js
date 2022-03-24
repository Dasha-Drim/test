const routerFranchisee = app => {
    app.use(require('./post-franchisee'));
    app.use(require('./delete-franchisee'));
    app.use(require('./get-franchisee'));
    app.use(require('./get-franchisee-id'));
    app.use(require('./get-franchisee-doc'));
}

module.exports = routerFranchisee;