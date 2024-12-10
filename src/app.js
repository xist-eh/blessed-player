import { SongsUtility } from "./helpers/songs.js";
import blessed from "blessed";
import { existsSync } from "node:fs";
import { SongsView } from "./ui/songsView.js";
import { PlaylistsView } from "./ui/playlistsView.js";
import { ProgramFiles } from "./helpers/files.js";
import { MixPlayer } from "mix-player";
import { RightView } from "./ui/rightView.js";
import { initFinder } from "./ui/finder.js";
import { initNewFolder } from "./ui/newFolder.js";

// Create a screen object.
const programScreen = blessed.screen({
  smartCSR: true,
});

programScreen.title = "blessed player";

await SongsUtility.init();

const songsView = SongsView(programScreen);
const playlistsView = PlaylistsView(programScreen);
const rightView = RightView(programScreen);

initFinder(programScreen);
initNewFolder(programScreen, songsView);

SongsUtility.uiSetCurrentSong = rightView.setCurrentSong;

await songsView.updateList(ProgramFiles.playlists.all);

songsView.list.focus();

programScreen.render();

programScreen.key(["q", "C-c"], function (ch, key) {
  return process.exit(0);
});
