SHELL=cmd

all: run

run: src/app.js
	node src/app.js

clean: 
	del prefs.json
	del songs.json
	del included-folders.json
	del playlists.json

addon:
	cd player && make