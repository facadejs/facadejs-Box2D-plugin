const Facade = require('facade.js');

require('../facadejs-Box2D');

const stage = new Facade(document.querySelector('canvas'));

const world = new Facade.Entity().Box2D('createWorld', {
    'canvas': stage.canvas,
    'gravity': [ 0, 20 ]
});

const box = new Facade.Rect({
    'x': 0,
    'y': 0,
    'width': 50,
    'height': 50
});

box.Box2D('createObject', world, {
    'type': 'dynamic',
    'rotate': true,
    'friction': 0.5
});

const floor = new Facade.Rect({
    'x': 0,
    'y': 390,
    'width': 400,
    'height': 10
});

floor.Box2D('createObject', world, {
    'type': 'static'
});

stage.draw(function () {

    this.clear();

    world.Box2D('step');

    this.addToStage([box, floor]);

    world.Box2D('drawDebug');

});

module.exports = {
    box,
    Facade,
    floor,
    stage,
    world
};
