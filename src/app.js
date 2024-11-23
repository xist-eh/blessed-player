import { SongsUtility } from "./helpers/songs.js";
import blessed from "blessed";

import { getSongsViewBox } from "./ui/songsView.js";

// Create a screen object.
const programScreen = blessed.screen({
  smartCSR: true,
});

programScreen.title = "blessed player";

await SongsUtility.init();
await SongsUtility.addRootFolder("test-music");

const songsViewBox = getSongsViewBox();

programScreen.append(songsViewBox);

songsViewBox.children[0].focus();

programScreen.render();

programScreen.key(["escape", "q", "C-c"], function (ch, key) {
  return process.exit(0);
});
