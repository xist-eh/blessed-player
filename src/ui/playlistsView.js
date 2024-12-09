import blessed from "blessed";
import { ProgramFiles } from "../helpers/files.js";
const PlaylistsView = (screen) => {
  const playlistList = blessed.list({
    top: "center",
    left: "5%",
    width: "15%",
    height: "75%",

    items: ["All", ...ProgramFiles.playlists.playlists],
    style: {
      selected: {
        fg: ProgramFiles.prefs.ui.secondaryColor,
      },
    },
  });

  playlistList.select(1);

  screen.append(playlistList);

  const factory = {};

  return factory;
};

export { PlaylistsView };
