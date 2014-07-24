#Facade.js Box2D Plugin

##Installing Using Bower

**bower.json**

```json
{
    "name": "example",
    "dependencies": {
        "facade.js": "0.3.0-beta.4",
        "facadejs-Box2D-plugin": "neogeek/facadejs-Box2D-plugin",
        "requirejs": "2.1.14"
    },
    "private": true
}
```

```bash
$ bower install
```

##Using Plugin With [RequireJS](http://requirejs.org/)

```javascript
require.config({
    'baseUrl': 'bower_components/',
    'paths': {
        'facade': 'facade.js/facade.min',
        'facadejs-Box2D-plugin': 'facadejs-Box2D-plugin/facadejs-Box2D',
        'box2dweb': 'facadejs-Box2D-plugin/vendor/box2dweb/Box2dWeb-2.1.a.3.min',
    },
    'shim': {
        'box2dweb': {
            'exports': 'Box2D'
        }
    }
});
```
