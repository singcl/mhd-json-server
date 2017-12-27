// server.js
const path = require('path');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(path.resolve(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({noCors: true});
const notFound = require('./middlewares/not-found/not-found');
const exphbs = require('express-handlebars');

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// 模板引擎设置 START======================================================================================
server.set('views', path.join(__dirname, 'views')); //path.join() 将path片段拼成规范的路径  放模板文件的目录
server.engine(
    'hbs',
    exphbs({
        //添加引擎
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        defaultLayout: 'main', //（默认打开的模板）
        extname: '.hbs'
    })
);
server.set('view engine', 'hbs'); //调用render函数时，自动添加hannlebars后缀  模板引擎
// 模板引擎设置 END======================================================================================

// Custom output example START================================================================================
// server.use('/api', router);
// Add this before server.use(router)
server.use(
    jsonServer.rewriter({
        '/api/*': '/$1',
        '/blog/:resource/:id/show': '/:resource/:id'
    })
);

// In this example, returned resources will be wrapped in a body property
router.render = (req, res) => {
    const result = {
        "data": {
            "total": 21,
            "page": 1,
            "size": 10,
            "list":res.locals.data
        }
    }
    res.jsonp(result);
};

// Add custom routes before JSON Server router
server.get('/test', (req, res) => {
    res.jsonp({
        data: 'test',
        query: req.query
    });
});

// 自定义查询参数KEY替换默认查询参数KEY
server.use('/', function(req, res, next){
    req.query['_limit'] = req.query['size'];
    req.query['_page'] = req.query['page'];
    next();
});

// Custom output example END================================================================================

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

// Use default router
server.use(router);

server.listen(3003, () => {
    console.log('JSON Server is running');
});
