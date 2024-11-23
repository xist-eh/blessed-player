SHELL := /bin/bash

all: build-addon

build-addon:
	rm -rf build
	node-gyp configure build

clean: 
	rm -rf build