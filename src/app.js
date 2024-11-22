import { ProgramFiles } from "./helpers/files.js";

import { SongsUtility } from "./helpers/songs.js";

import { mixPlayer } from "./player/player.js";

await SongsUtility.init();

await SongsUtility.addRootFolder("test-music");

const obj = mixPlayer("hello");

console.log(obj.msg);
