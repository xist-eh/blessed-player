

all: run

run: src/app.js
	node src/app.js

clean: 
	rm  prefs.json
	rm songs.json
	rm included-folders.json
	rm playlists.json

player-addon:
	cd player && make