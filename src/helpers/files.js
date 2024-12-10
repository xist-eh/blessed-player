import { readFileSync, existsSync, writeFile, writeFileSync, write } from "fs";
import { createHash } from "crypto";
import path from "path";

class ProgramFiles {
  static prefsFile = path.resolve("./config/prefs.json");
  static indexFile = path.resolve("./config/index.json");
  static includedfoldersFile = path.resolve("./config/included-folders.json");
  static playlistsFile = path.resolve("./config/playlists.json");

  prefs = Object.seal({
    recursiveFolderSearch: true,
    namePattern: "{artist} - {name}",
    ui: {
      primaryColor: "#89CFF0",
      secondaryColor: "#088F8F",
      bgColor: "#7393B3",
    },
  });

  includedFolders = Object.seal({
    folders: [],
  });

  songsIndex = {};

  playlists = Object.seal({
    all: [],
    user: {},
  });

  saveIndex() {
    writeFileSync(ProgramFiles.indexFile, JSON.stringify(this.songsIndex));
  }

  savePrefs() {
    writeFileSync(ProgramFiles.prefsFile, JSON.stringify(this.prefs));
  }
  saveIncludedFolders() {
    writeFileSync(
      ProgramFiles.includedfoldersFile,
      JSON.stringify(this.includedFolders)
    );
  }
  savePlaylists() {
    writeFileSync(ProgramFiles.playlistsFile, JSON.stringify(this.playlists));
  }

  constructor() {
    //Singleton
    if (ProgramFiles._instance) {
      throw new Error("New Instance of ProgramFiles class cannot be created!");
    }
    ProgramFiles._instance = this;

    //Fetch or create config of program files

    //For prefs file
    existsSync(ProgramFiles.prefsFile)
      ? Object.entries(
          JSON.parse(readFileSync(ProgramFiles.prefsFile))
        ).forEach(([key, val]) => (this.prefs[key] = val))
      : this.savePrefs();

    //For index file

    //For folder file
    existsSync(ProgramFiles.includedfoldersFile)
      ? Object.entries(
          JSON.parse(readFileSync(ProgramFiles.indexFile))
        ).forEach(([key, val]) => (this.songsIndex[key] = val))
      : this.saveIndex();
    //For playlists file
    existsSync(ProgramFiles.playlistsFile)
      ? Object.entries(
          JSON.parse(readFileSync(ProgramFiles.playlistsFile))
        ).forEach(([key, val]) => (this.playlists[key] = val))
      : this.savePlaylists();
  }
}

const ProgramFilesInstance = new ProgramFiles();

export { ProgramFilesInstance as ProgramFiles };
