module.exports = function(params) {
    //
    return function(req, res, next) {
        // res.sendStatus(200); // equivalent to res.status(200).send('OK')
        // res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
        // res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
        // res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
        res.status(404).render('404');
    }
}