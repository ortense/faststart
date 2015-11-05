'use strict';

class Home extends Controller {

    action_index() {
        return View.send('home.index');
    }

    action_json() {
        return View.json({home:'json'});
    }

    other() {
        return View.send('home.other');
    }
}

module.exports = Home;
