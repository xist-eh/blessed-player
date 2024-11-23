import blessed from "blessed";
import { SongsUtility } from "../helpers/songs.js";

const getSongsViewBox = () => {
  const songsViewBox = blessed.box({});

  const songsList = blessed.listtable({
    keys: true,
    width: "65%",
    height: "75%",
    top: 0,
    left: "center",
    align: "left",
    data: [["Song", "Artist", "Duration"], ...SongsUtility.getSongs()],
    style: {
      cell: {
        selected: {
          bg: "red",
        },
      },
    },
  });

  songsViewBox.append(songsList);

  songsList.on("select", (item, index) => {
    SongsUtility.playSong(index);
  });

  return songsViewBox;
};

export { getSongsViewBox };
