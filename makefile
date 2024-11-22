

all: run

run: src/app.js
	node src/app.js

clean: 
	rm config/prefs.json
	rm config/songs.json
	rm config/included-folders.json
	rm config/playlists.json

clean-addon:
	rm -rf src/player/build

addon:
	cd src/player && make