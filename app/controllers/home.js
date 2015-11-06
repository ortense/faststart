'use strict';

class Home extends Controller {

    action_index() {
        return View.render('index', {
            title: 'home.action_index'
        });
    }

    action_async() {
        return View.render('index', function(next) {
            //run async code
            setTimeout(() => {
                //set locals
                next({title: 'home.action_async'});
            }, 10);
        });
    }

    action_json() {
        return View.json({home:'json'});
    }

    other() {
        return View.send('home.other');
    }

    /** Como fazer isso funcionar?
     * get: /hello
     * get: /hello/:name
     * get: /hello/:name/:lastname
     */
    action_hello(name) {
        name = name || 'word';
        return View.render('index', {
            title: `Hello ${name.charAt(0).toUpperCase()}${name.slice(1)}!!`
        });
    }
}

module.exports = Home;
