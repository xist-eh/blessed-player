

all: run

run: src/app.js
	node src/app.js

clean: 
	rm config/prefs.json
	rm config/songs.json
	rm config/included-folders.json
	rm config/playlists.json

player-addon:
	cd src/player && make