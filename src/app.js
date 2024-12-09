import { SongsUtility } from "./helpers/songs.js";
import blessed from "blessed";
import { existsSync } from "node:fs";
import { SongsView } from "./ui/songsView.js";
import { PlaylistsView } from "./ui/playlistsView.js";
import { ProgramFiles } from "./helpers/files.js";
import { MixPlayer } from "mix-player";
import { RightView } from "./ui/rightView.js";
import { initFinder } from "./ui/finder.js";

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

SongsUtility.rightView = rightView;

songsView.updateList(ProgramFiles.songs.index);

songsView.list.focus();

programScreen.render();

programScreen.key(["q", "C-c"], function (ch, key) {
  return process.exit(0);
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
