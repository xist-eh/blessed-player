import getFolderSize from "get-folder-size";
import path from "path";
import { parseFile } from "music-metadata";
import { createHash } from "crypto";
import {
  writeFile,
  readdirSync,
  readFileSync,
  existsSync,
  mkdirSync,
  readdir,
  statSync,
  writeFileSync,
} from "fs";

class ProgramState {
  ROOT_FOLDER = "";
  PRIMARY_COLOR = "#fffff";
  SECONDARY_COLOR = "#fffff";
  RECURSIVELY_FIND_SONGS;
  songsIndex;
  constructor() {
    if (ProgramState._instance) {
      throw new Error("New instance of program state created");
    }
    ProgramState._instance = this;
  }
  async initializeRootFolder() {
    if (!existsSync(this.ROOT_FOLDER))
      throw new Error("Supplied directory does not exist!");
    const jsonobjectprefs = JSON.parse(readFileSync("./prefs.json"));
    jsonobjectprefs["defaultFolder"] = this.ROOT_FOLDER;
    writeFileSync("./prefs.json", JSON.stringify(jsonobjectprefs), (err) => {
      if (err) throw err;
    });

    if (!existsSync(this.ROOT_FOLDER + ".blessed-player")) {
      mkdirSync(this.ROOT_FOLDER + ".blessed-player");
      this.RECURSIVELY_FIND_SONGS =
        (await getFolderSize(this.ROOT_FOLDER)).size / 1048576 < 750
          ? true
          : false;
      const writeConfigJSON = {
        recursivelyFindSongs: this.RECURSIVELY_FIND_SONGS,
      };

      writeFileSync(
        this.ROOT_FOLDER + ".blessed-player/config.json",
        JSON.stringify(writeConfigJSON),
        (err) => {
          if (err) throw new Error(err);
        }
      );
    } else {
      const config = JSON.parse(
        readFileSync(this.ROOT_FOLDER + ".blessed-player/config.json")
      );
      this.RECURSIVELY_FIND_SONGS = config.recursivelyFindSongs;
    }

    await this.completeSongFileIndex();
  }
  async initialize(ROOT_FOLDER = null) {
    if (ROOT_FOLDER) {
      ROOT_FOLDER += ROOT_FOLDER.at(ROOT_FOLDER.length - 1) === "/" ? "" : "/";
      if (!existsSync(ROOT_FOLDER))
        throw new Error("Supplied directory does not exist!");
    }

    if (!existsSync("./prefs.json")) {
      this.ROOT_FOLDER = ROOT_FOLDER || "./";

      const configJSON = {
        primaryColor: this.PRIMARY_COLOR,
        secondaryColor: this.SECONDARY_COLOR,
      };
      writeFileSync("./prefs.json", JSON.stringify(configJSON), (err) => {
        if (err) throw err;
      });
    } else {
      const prefs = JSON.parse(readFileSync("./prefs.json"));

      this.ROOT_FOLDER = ROOT_FOLDER || prefs.defaultFolder;
      this.PRIMARY_COLOR = prefs.primaryColor;
      this.SECONDARY_COLOR = prefs.secondaryColor;
    }

    await this.initializeRootFolder();
  }
  async completeSongFileIndex() {
    const allowedFileTypes = [".mp4", ".m4a", ".mp3"];
    async function indexSongFile(absolutePath) {
      const fileName = path.basename(absolutePath);
      const metadata = await parseFile(absolutePath);
      return {
        key: createHash("md5").update(fileName).digest("base64url"),
        value: {
          absolutePath: absolutePath,
          name: metadata.common.title,
          duration: Math.round(metadata.format.duration),
          artist: metadata.common.albumartist,
        },
      };
    }
    async function getFilesRecursive(dir) {
      const returnIndex = {};

      for (const item of readdirSync(dir)) {
        const absolutePath = path.join(dir, item);
        try {
          if (statSync(absolutePath).isDirectory()) {
            returnIndex.push(...getFilesRecursive(absolutePath));
          } else {
            if (allowedFileTypes.includes(path.extname(absolutePath))) {
              const index = await indexSongFile(absolutePath);

              returnIndex[index.key] = index.value;
            }
          }
        } catch (err) {}
      }
      return returnIndex;
    }
    if (this.RECURSIVELY_FIND_SONGS === true) {
      this.songsIndex = await getFilesRecursive(this.ROOT_FOLDER);
    } else {
      readdirSync(this.ROOT_FOLDER).forEach(async (item) => {
        try {
          if (
            !statSync(this.ROOT_FOLDER + item).isDirectory() &&
            allowedFileTypes.includes(path.extname(item))
          ) {
            this.songsIndex.push(await indexSongFile(this.ROOT_FOLDER + item));
          }
        } catch (err) {}
      });
    }
  }
}

let stateUtilityInstance = new ProgramState();

export default stateUtilityInstance;
