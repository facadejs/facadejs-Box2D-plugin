/*jslint browser: true, nomen: true */
/*globals Facade, Box2D */

(function (Facade) {

    'use strict';

    var contactListeners = ['PreSolve', 'PostSolve', 'BeginContact', 'EndContact'],
        methods,
        TO_DEGREES = 180 / Math.PI;

    function hasBox2DEntityRef(obj) {

        return obj._box2d !== undefined && obj._box2d.entity !== undefined;

    }

    function resolveContactListener(entities) {

        var a = entities.GetFixtureA().GetBody().GetUserData(),
            b = entities.GetFixtureB().GetBody().GetUserData();

        if (a && typeof a._box2d.callback[this.type] === 'function') {

            a._box2d.callback[this.type].call(a, a, b);

        }

        if (b && typeof b._box2d.callback[this.type] === 'function') {

            b._box2d.callback[this.type].call(b, a, b);

        }

    }

    methods = {

        createObject: function (world, config) {

            var body = new Box2D.Dynamics.b2BodyDef(),
                fixture = new Box2D.Dynamics.b2FixtureDef(),
                options = this._configOptions(this.getAllOptions()),
                metrics = this.getAllMetrics(),
                vertices = [],
                key,
                defaults = {
                    type: 'static',
                    fixedRotation: false,
                    density: 1.0,
                    friction: 0.5,
                    restitution: 0.5,
                    scale: 30
                };

            if (config === undefined) {

                config = {};

            }

            Object.keys(defaults).forEach(function (key) {

                if (config[key] === undefined) {

                    config[key] = defaults[key];

                }

            });

            body.userData = this;

            if (config.type === 'dynamic') {

                body.type = Box2D.Dynamics.b2Body.b2_dynamicBody;

            } else if (config.type === 'kinematic') {

                body.type = Box2D.Dynamics.b2Body.b2_kinematicBody;

            } else {

                body.type = Box2D.Dynamics.b2Body.b2_staticBody;

            }

            body.fixedRotation = config.fixedRotation;
            body.angle = options.rotate * (Math.PI / 180);

            body.position = new Box2D.Common.Math.b2Vec2(
                metrics.x / config.scale,
                metrics.y / config.scale
            );

            for (key in options.points) {

                if (options.points[key] !== undefined) {

                    vertices.push(
                        new Box2D.Common.Math.b2Vec2(
                            (options.points[key][0] / config.scale),
                            options.points[key][1] / config.scale
                        )
                    );

                }

            }

            fixture.density = config.density;
            fixture.friction = config.friction;
            fixture.restitution = config.restitution;

            fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
            fixture.shape.SetAsArray(vertices, options.points.length);

            world._box2d.entity.CreateBody(body).CreateFixture(fixture);

            if (this._box2d !== undefined) {

                methods.destroyObject.call(this, world._box2d.entity);

            }

            this._box2d = {
                entity: world._box2d.entity.GetBodyList(),
                config: config,
                callback: {
                    BeginContact: null,
                    EndContact: null,
                    PostSolve: null,
                    PreSolve: null
                }
            };

            return this;

        },

        createWorld: function (config) {

            var world,
                listener = new Box2D.Dynamics.b2ContactListener(),
                debugDraw = new Box2D.Dynamics.b2DebugDraw(),
                defaults = {
                    canvas: null,
                    gravity: 40,
                    sleep: false
                };

            if (config === undefined) {

                config = {};

            }

            Object.keys(defaults).forEach(function (key) {

                if (config[key] === undefined) {

                    config[key] = defaults[key];

                }

            });

            world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, config.gravity), config.sleep);

            contactListeners.forEach(function (type) {

                listener[type] = resolveContactListener.bind({ type: type });

            });

            world.SetContactListener(listener);

            if (config.canvas) {

                if (config.canvas instanceof Facade) {

                    debugDraw.SetSprite(config.canvas.context);

                } else if (typeof config.canvas === 'object' && config.canvas.nodeType === 1) {

                    debugDraw.SetSprite(config.canvas.getContext('2d'));

                }

                debugDraw.SetDrawScale(30);
                debugDraw.SetFillAlpha(0.3);
                debugDraw.SetLineThickness(1.0);
                debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_centerOfMassBit);
                world.SetDebugDraw(debugDraw);

            }

            this._box2d = {
                entity: world,
                config: config
            };

            return this;

        },

        drawDebug: function () {

            if (hasBox2DEntityRef(this) && this._box2d.entity instanceof Box2D.Dynamics.b2World) {

                this._box2d.entity.DrawDebugData();

            }

        },

        destroyObject: function () {

            var self = this;

            if (hasBox2DEntityRef(this)) {

                self._box2d.entity.SetUserData(null);

                setTimeout(function () {

                    self._box2d.entity.GetWorld().DestroyBody(self._box2d.entity);

                    delete self._box2d;

                }, 0);

            }

        },

        getCurrentState: function () {

            if (hasBox2DEntityRef(this)) {

                return {
                    x: this._box2d.entity.GetPosition().x * this._box2d.config.scale,
                    y: this._box2d.entity.GetPosition().y * this._box2d.config.scale,
                    rotate: this._box2d.entity.GetAngle() * TO_DEGREES
                };

            }

        },

        getPosition: function () {

            if (hasBox2DEntityRef(this)) {

                var vector = this._box2d.entity.GetPosition();

                return {
                    x: vector.x,
                    y: vector.y
                };

            }

        },

        getVelocity: function () {

            if (hasBox2DEntityRef(this)) {

                return {
                    x: this._box2d.entity.m_linearVelocity.x,
                    y: this._box2d.entity.m_linearVelocity.y
                };

            }

        },

        setCallback: function (type, callback) {

            if (hasBox2DEntityRef(this)) {

                if (this._box2d.callback[type] !== undefined) {

                    this._box2d.callback[type] = callback;

                } else {

                    console.error(type + ' is not a valid callback type.');

                }

            }

        },

        setPosition: function (x, y) {

            if (hasBox2DEntityRef(this)) {

                this._box2d.entity.SetPosition(new Box2D.Common.Math.b2Vec2(x, y));

            }

        },

        setVelocity: function (x, y) {

            if (hasBox2DEntityRef(this)) {

                if (x === undefined) {

                    x = 0;

                }

                if (y === undefined) {

                    y = 0;

                }

                this._box2d.entity.SetLinearVelocity(
                    new Box2D.Common.Math.b2Vec2(x, y),
                    this._box2d.entity.GetWorldCenter()
                );

            }

        },

        step: function () {

            if (hasBox2DEntityRef(this) && this._box2d.entity instanceof Box2D.Dynamics.b2World) {

                this._box2d.entity.Step(1 / 60, 8, 3);

            }

        }

    };

    Facade.Entity.prototype.Box2D = function (method) {

        if (!methods[method]) {

            console.error(method + ' is not a method specified in this plugin.');

        }

        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

    };

}(Facade));
