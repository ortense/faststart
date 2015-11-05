'use strict';

class Home extends Controller {

    action_index() {
        return View.render('index', {
            title: 'home.action_index'
        });
    }

    action_json() {
        return View.json({home:'json'});
    }

    other() {
        return View.send('home.other');
    }
}

module.exports = Home;
