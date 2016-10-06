BIN=node_modules/.bin

test:
	make lint

lint:
	$(BIN)/jslint facadejs-Box2D.js

.PHONY: test
