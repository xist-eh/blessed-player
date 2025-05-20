import { SongsUtility } from "./helpers/songs.js";
import blessed from "blessed";
import { ProgramFiles } from "./helpers/files.js";
import { UI } from "./helpers/uiBridge.js";

await SongsUtility.init();

UI.init();
UI.render();

UI.keypress(["q", "C-c"], function (ch, key) {
  return process.exit(0);
});
