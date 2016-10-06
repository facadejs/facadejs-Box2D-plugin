BIN=node_modules/.bin

test:
	make lint

lint:
	$(BIN)/jslint facadejs-Box2D.js

build:
	$(BIN)/spire-of-babel test/test.js --bundle --minify --sourcemap --output test/build.min.js

serve:
	$(BIN)/http-server .

.PHONY: test
