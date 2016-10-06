# Facade.js Box2D Plugin

## Installing Using NPM

**package.json**

```json
{
    "dependencies": {
        "facade.js": "0.3.0-beta.7",
        "facadejs-Box2D-plugin": "neogeek/facadejs-Box2D-plugin"
    }
}
```

```bash
$ npm install
```

## Example Usage

```javascript
const stage = new Facade(document.querySelector('canvas'));

require('facadejs-Box2D-plugin');

const world = new Facade.Entity().Box2D('createWorld', {
    'canvas': stage.canvas,
    'gravity': [ 0, 20 ] });

const entity = new Facade.Rect({
    'x': 0,
    'y': 0,
    'width': 50,
    'height': 50
});

entity.Box2D('createObject', world, {
    'type': 'dynamic',
    'rotate': true,
    'friction': 0.5
});
```
