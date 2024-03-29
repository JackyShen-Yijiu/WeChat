// Babel ES6/JSX Compiler
require('babel-register');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var swig = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var DocumentTitle = require('react-document-title');

var routes = require('./app/routes');

var weinxinRouter = require("./routes/route_weixin");
var apiRouter = require("./routes/route_jzapiv1");
var messageRouter = require('./routes/route_message');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, Authorization');
    if (req.method.toUpperCase() === 'OPTIONS') {
        return res.end();
    }
    next();
});
app.use("/jzapi/weixin", weinxinRouter);
app.use("/jzapi/v1", apiRouter);
app.use('/wechat', messageRouter.wechat);

app.use(function(req, res) {
    Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
        if (err) {
            res.status(500).send(err.message)
        } else if (redirectLocation) {
            res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
            var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
            DocumentTitle.rewind();
            var page = swig.renderFile('views/index.html', { html: html });
            res.status(200).send(page);
        } else {
            res.status(404).send('Page Not Found')
        }
    });
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
