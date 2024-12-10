import blessed from "blessed";

import { ProgramFiles } from "../helpers/files.js";

export function initFinder(programScreen) {
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
    inp.key("escape", () => {
      programScreen.remove(header);
      programScreen.remove(inp);
      programScreen.render();
    });
  });
}
