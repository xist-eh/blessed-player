import blessed from "blessed";

import { SearchBox } from "../ui/searchBox.js";
import { NewFolderDialogue } from "../ui/addFolderDialogue.js";
import { SongsView } from "../ui/songsView.js";
import { PlaylistsView } from "../ui/playlistsView.js";
import { RightView } from "../ui/rightView.js";
import { ProgramFiles } from "./files.js";

const programScreen = blessed.screen({
  smartCSR: true,
});

const songsView = SongsView(programScreen);
const playlistsView = PlaylistsView(programScreen);
const rightView = RightView(programScreen);
const searchBox = SearchBox(programScreen);
const newFolderDialogue = NewFolderDialogue(programScreen);

export const UI = (() => {
  const factory = {
    init: () => {
      songsView.updateList(ProgramFiles.playlists.all);
      songsView.focusOnElement();
    },
    setScreenTitle: (title) => (programScreen.title = title),
    keypress: (key, fn) => programScreen.key(key, fn),
    render: () => programScreen.render(),
  };

  return factory;
})();

export const uiBridge = (() => {
  const factory = {
    updateSongsViewList: (list) => songsView.updateList(list),
    updateCurrentlyPlayingSong: (name) => {
      rightView.setCurrentSong(name);
    },
  };
  return factory;
})();
