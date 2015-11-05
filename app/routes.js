'use strict';

Route.bind('/', 'home');

Route.get('/other_path', 'home.other');

Route.get('/teste', (req, res) => {
    res.send('teste');
});
