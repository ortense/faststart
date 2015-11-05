'use strict';

class Base {
    constructor() {
        this.constructor.__instances = this.constructor.__instances || [];
        this.constructor.__instances.push(this);
    }
    static all(){
        return this.__instances;
    }
}

global.Model = class Model extends Base {};

global.View = class View {
    static send(message) {
        return (req, res) => res.send(message);
    }

    static json(object) {
        return (req, res) => res.json(object);
    }

    static render(view, locals, cb) {
        if (locals && 'function' === typeof locals){
            return (req, res) => {
                locals(locals => {
                    res.render(view, locals, cb);
                });
            }
        }
        return (req, res) => res.render(view, locals, cb);
    }
};

global.Controller = class Controller extends Base {
    __get_actions() {

        let propertys = Object.getOwnPropertyNames(this.constructor.prototype)

        let actions = []

        propertys = propertys.filter(prop => {
            return prop.indexOf('action_') === 0;
        }).forEach(prop => {
            let verb, path, aux;
            aux = prop.split('_');
            verb = aux[2] ? aux[1] : 'get';
            path = aux[2] ? aux[2] : aux[1];
            path = 'index' === path ? '/' : path;
            actions.push({name: prop, verb, path});
        });

        return actions;
    }
};

const router = require('express').Router();
const path   = require('path');

global.Route = class Route {

    static bind(route_string, controller_name) {
        let controller = new Controller.heirs[controller_name]();
        controller.__get_actions().forEach(action => {
            router[action.verb](
                Helper.str_replace_all(
                    path.join(route_string, action.path), '\\', '/'
                ),
                controller[action.name]()
            );
        });
    }

    static get(route_string, func) {
        router.get(route_string, this.__resolve(func));
    }

    static post(route_string, func) {
        router.post(route_string, this.__resolve(func));
    }

    static put(route_string, func) {
        router.put(route_string, this.__resolve(func));
    }

    static delete(route_string, func) {
        router.delete(route_string, this.__resolve(func));
    }

    static __get_router() { return router }
    static __resolve(func) {
        let controller, action;
        if ('string' === typeof func) {
            func = func.split('.');
            controller = new Controller.heirs[func[0]]();
            action = func[1]
            if (action) return controller[action]();
            else if (controller.index) return controller.index();
            else if (controller.action_index) return controller.action_index();
            else return func;
        }
        else return func;
    }
};

global.Helper = class Helper {
    static str_replace_all(str, token, newtoken) {
		while (str.indexOf(token) !== -1) {
			str = str.replace(token, newtoken);
		}
		return str;
	}
};
