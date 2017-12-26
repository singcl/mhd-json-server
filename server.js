// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({noCors: true});

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// In this example, returned resources will be wrapped in a body property
router.render = (req, res) => {
    res.jsonp({
        body: res.locals.data
    });
};

// Add custom routes before JSON Server router
server.get('/test', (req, res) => {
    res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
    if (req.method === 'POST') {
        req.body.createdAt = Date.now();
    }
    // Continue to JSON Server router
    next();
});

// Add this before server.use(router)
server.use(
    jsonServer.rewriter({
        '/api/*': '/$1',
        '/blog/:resource/:id/show': '/:resource/:id'
    })
);

// Use default router
server.use(router);
server.listen(3003, () => {
    console.log('JSON Server is running');
});
