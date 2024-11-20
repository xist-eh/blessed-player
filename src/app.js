import { ProgramFiles } from "./helpers/files.js";

import { SongsUtility } from "./helpers/songs.js";

await SongsUtility.init();

await SongsUtility.addRootFolder("test-music");

await SongsUtility.playSong(
  "D:\\Dev\\blessed-player\\test-music\\Bound 2 - Kanye West.mp3"
);
