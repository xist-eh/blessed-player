import { SongsUtility } from "./helpers/songs.js";
import * as blessed from "blessed";

await SongsUtility.init();

// Create a screen object.
const screen = blessed.screen({
  smartCSR: true,
});

screen.title = "my window title";
