//set depending on whether program is built or not
const DEV_MODE = true;

import { exec } from "child_process";
import blessed from "blessed";

import state from "./StateManager.js";

(async () => {
  await state.initialize(
    DEV_MODE && process.argv.length > 2
      ? process.argv.at(2)
      : !DEV_MODE && process.argv.length > 1
      ? process.argv.at(1)
      : null
  );

  const screen = blessed.screen({
    smartCSR: true,
  });

  screen.title = "blessed player";

  const SongsList = blessed.listtable({
    keys: true,
    top: 0,
    pad: 0,
    align: "left",
    width: "50%",
    rows: [
      ["Song", "Artist", "Duration"],
      ...Object.values(state.songsIndex).map((a) => [
        a.name.length > screen.width * 0.3
          ? a.name.substr(0, screen.width * 0.3) + ".."
          : a.name,
        a.artist,
      ]),
    ],
    style: {
      cell: {
        selected: {
          bg: "red",
        },
      },
    },
  });

  screen.append(SongsList);

  SongsList.focus();
  screen.render();

  // Quit on Escape, q, or Control-C.
  screen.key(["escape", "q", "C-c"], function (ch, key) {
    return process.exit(0);
  });

  SongsList.on("select", (item) => {
    exec("F:/Music/I Can't Handle Change - Roar.mp3");
  });

  //See if program has indexed this folder
})();
