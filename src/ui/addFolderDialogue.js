import blessed from "blessed";
import { ProgramFiles } from "../helpers/files.js";
import { existsSync } from "node:fs";
import { SongsUtility } from "../helpers/songs.js";
import { uiBridge } from "../helpers/uiBridge.js";

export function NewFolderDialogue(programScreen, songsView) {
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

        await uiBridge.updateSongsViewList(ProgramFiles.playlists.all);

        programScreen.remove(inp);
        programScreen.remove(header);
        programScreen.render();
      })();
    });
    inp.key("escape", () => {
      programScreen.remove(header);
      programScreen.remove(inp);
      programScreen.render();
    });
  });
}
