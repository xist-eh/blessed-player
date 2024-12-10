import blessed from "blessed";
import { SongsUtility } from "../helpers/songs.js";
import { ProgramFiles } from "../helpers/files.js";

const prettyDuration = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = "0" + (time - minutes * 60).toString();
  return minutes.toString() + ":" + seconds.substring(seconds.length - 2);
};

const SongsView = (screen) => {
  const songsViewBox = blessed.box({});

  screen.append(songsViewBox);

  let songsList = [];
  let numDisplayedItems = 0;

  const songsNameHeader = blessed.text({
    content: "{bold}Song{/bold}",
    tags: true,
    top: 1,
    left: "20%",
  });
  const songArtistsHeader = blessed.text({
    content: "{bold}Artists{/bold}",
    tags: true,
    top: 1,
    left: "45%",
  });
  const songDurationsHeader = blessed.text({
    content: "{bold}Duration{/bold}",
    tags: true,
    top: 1,
    left: "62%",
  });
  const songsNameList = blessed.list({
    width: "28%",
    height: "75%",
    top: songsNameHeader.position.top + 1,
    left: "20%",
    align: "left",

    style: {
      selected: {
        fg: "black",
        bg: ProgramFiles.prefs.ui.primaryColor,
      },
    },
  });
  const songArtistsList = blessed.list({
    width: "15%",
    height: "75%",
    top: songArtistsHeader.position.top + 1,
    left: "47%",
    align: "left",

    style: {
      selected: {
        fg: "black",
        bg: ProgramFiles.prefs.ui.primaryColor,
      },
    },
  });
  const songDurationsList = blessed.list({
    width: 8,
    height: "75%",
    top: songDurationsHeader.position.top + 1,
    left: "60%",
    align: "center",

    style: {
      selected: {
        fg: "black",
        bg: ProgramFiles.prefs.ui.primaryColor,
      },
    },
  });

  let songsListIndex = 0;

  const songsListBox = blessed.box({
    children: [
      songsNameHeader,
      songArtistsHeader,
      songDurationsHeader,
      songsNameList,
      songArtistsList,
      songDurationsList,
    ],
  });

  songsListBox.key("up", () => {
    if (songsListIndex > 0) {
      songsListIndex--;
    }
    songsNameList.up();
    songArtistsList.up();
    songDurationsList.up();

    screen.render();
  });
  songsListBox.key("down", () => {
    if (songsListIndex < songsList.length - 1) {
      songsListIndex++;
    }

    songsNameList.down();
    songArtistsList.down();
    songDurationsList.down();

    screen.render();
  });
  songsListBox.key("enter", () => {
    if (songsList[songsListIndex]) {
      SongsUtility.playSong(songsList[songsListIndex]);
    }
  });

  songsViewBox.append(songsListBox);

  const factory = {
    element: songsViewBox,
    list: songsListBox,
    updateList: async (list) => {
      songsList = list;
      songsNameList.clearItems();
      songArtistsList.clearItems();
      songDurationsList.clearItems();

      numDisplayedItems = Math.min(songsList.length, songsNameList.height);

      for (const i of songsList) {
        const data = SongsUtility.getIndexedSongInfo(i);
        if (!data) {
          throw "Could not get index of current file, which is" + i;
        }
        songsNameList.addItem(data.trackName || "hi");
        songArtistsList.addItem(data.artist || "hello");
        songDurationsList.addItem(prettyDuration(data.duration) || "no");
      }
    },
  };

  return factory;
};

export { SongsView };
