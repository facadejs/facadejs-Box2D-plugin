import assert from 'assert';

import {
    box,
    Facade,
    floor,
    stage,
    world
} from './example';

describe('facadejs-Box2D-plugin', () => {

    it('should generate a Box2D Facade Object', () => {

        assert.ok(box._box2d);

    });

    it('should be falling once page loads', done => {

        setTimeout(() => {

            assert.ok(box.Box2D('getPosition').y !== 0);

            done();

        }, 100);

    });

    it('should sleep after colliding with flow', done => {

        let interval = setInterval(() => {

            if (!box._box2d.entity.IsAwake()) {

                clearInterval(interval);

                done();

            }

        }, 100);

    });

});
