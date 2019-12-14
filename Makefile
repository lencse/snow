.PHONY: watch lint lint_fix compile clean

BIN=node_modules/.bin

public: build/compile src views
	$(BIN)/webpack

clean:
	rm -rf public build

node_modules: package.json yarn.lock
	yarn && touch node_modules

build/compile: src config node_modules
	make compile && touch build/compile

watch: node_modules
	make clean && make build/compile && ( \
		$(BIN)/tsc -p . --outDir ./build/compile --watch --pretty & \
		$(BIN)/webpack-dev-server \
	)

lint: node_modules
	$(BIN)/tslint -c tslint.json -p .

lint_fix: node_modules
	$(BIN)/tslint -c tslint.json --fix -p .

compile:
	$(BIN)/tsc -p . --outDir ./build/compile
