import { ProgramFiles } from "./helpers/files.js";

import { SongsUtility } from "./helpers/songs.js";

import { mixerPlayer_addon } from "./player/player.js";

await SongsUtility.init();

await SongsUtility.addRootFolder("test-music");

const obj = new mixerPlayer_addon.MyObject(10);

console.log(obj.plusOne());
