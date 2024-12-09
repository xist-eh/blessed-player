import { SongsUtility } from "./helpers/songs.js";
import blessed from "blessed";
import { existsSync } from "node:fs";
import { SongsView } from "./ui/songsView.js";
import { PlaylistsView } from "./ui/playlistsView.js";
import { ProgramFiles } from "./helpers/files.js";
import { MixPlayer } from "mix-player";
import { RightView } from "./ui/rightView.js";

// Create a screen object.
const programScreen = blessed.screen({
  smartCSR: true,
});

programScreen.title = "blessed player";

await SongsUtility.init();

const songsView = SongsView(programScreen);
const playlistsView = PlaylistsView(programScreen);
const rightView = RightView(programScreen);

SongsUtility.rightView = rightView;

songsView.updateList(ProgramFiles.songs.index);

songsView.list.focus();

programScreen.render();

programScreen.key(["q", "C-c"], function (ch, key) {
  return process.exit(0);
});

programScreen.key(["f"], () => {
  const inp = blessed.textbox({
    keys: true,
    top: 1,
    left: "25%",
    width: 45,
    height: 3,
    border: {
      type: "line",
    },
    style: {
      border: {
        fg: ProgramFiles.prefs.ui.bgColor,
      },
    },
  });
  const header = blessed.text({
    content: "Search for a song:",
    top: inp.position.top,
    left: inp.position.left,
    style: {
      fg: ProgramFiles.prefs.ui.bgColor,
    },
  });
  programScreen.append(inp);
  programScreen.append(header);
  header.rleft += 1;
  inp.focus();
  programScreen.render();

  inp.on("submit", () => {
    const found = Object.entries(ProgramFiles.songs.index).filter(
      (val) =>
        val[1].trackName
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]/g, "")
          .includes(inp.value.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")) ||
        val[1].artist
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]/g, "")
          .includes(inp.value.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""))
    );

    if (found.length === 0) {
      header.content = "No songs found";
      programScreen.render();
      return;
    }

    const viewobj = {};

    for (const i of found) {
      viewobj[i[0]] = i[1];
    }

    songsView.updateList(viewobj);

    programScreen.remove(inp);
    programScreen.remove(header);
    programScreen.render();
  });
  inp.on("cancel", () => {
    programScreen.remove(header);
    programScreen.remove(inp);
    programScreen.render();
  });
});

programScreen.key("o", () => {
  const inp = blessed.textbox({
    keys: true,
    top: 1,
    left: "25%",
    width: 45,
    height: 3,
    border: {
      type: "line",
    },
    style: {
      border: {
        fg: ProgramFiles.prefs.ui.bgColor,
      },
    },
  });
  const header = blessed.text({
    content: "Type folder location:",
    top: inp.position.top,
    left: inp.position.left,
    style: {
      fg: ProgramFiles.prefs.ui.bgColor,
    },
  });

  programScreen.append(inp);
  programScreen.append(header);
  header.rleft += 1;
  inp.focus();
  programScreen.render();

  inp.on("submit", () => {
    if (!existsSync(inp.value)) {
      header.content = "Folder doesn't exist!";
      programScreen.render();
      return;
    }
    (async () => {
      await SongsUtility.addRootFolder(inp.value);

      songsView.updateList(ProgramFiles.songs.index);

      programScreen.remove(inp);
      programScreen.remove(header);
      programScreen.render();
    })();
  });
  inp.on("cancel", () => {
    programScreen.remove(header);
    programScreen.remove(inp);
    programScreen.render();
  });
});
