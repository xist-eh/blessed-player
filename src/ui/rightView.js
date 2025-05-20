import blessed from "blessed";
import { ProgramFiles } from "../helpers/files.js";

/**
 *
 * @param {blessed.Widgets.Screen} screen
 * @returns
 */
export const RightView = (screen) => {
  const currentlyPlayingHeader = blessed.text({
    top: -1,
    left: 1,

    content: "Currently playing",
    style: {
      fg: ProgramFiles.prefs.ui.secondaryColor,
    },
  });
  const currentlyPlaying = blessed.box({
    content: "",
    top: 2,
    height: 3,
    width: "20%",
    border: {
      type: "line",
    },
    left: "70%",
    style: {
      border: {
        fg: ProgramFiles.prefs.ui.secondaryColor,
      },
    },
  });
  currentlyPlaying.append(currentlyPlayingHeader);
  screen.append(currentlyPlaying);

  const factory = {
    setCurrentSong: (name) => {
      currentlyPlaying.content = name;
      screen.render();
    },
  };
  return factory;
};
