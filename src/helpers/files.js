import { readFileSync, existsSync, writeFile, writeFileSync, write } from "fs";
import { createHash } from "crypto";
import path from "path";

class ProgramFiles {
  static prefsFile = path.resolve("./config/prefs.json");
  static songsFile = path.resolve("./config/songs.json");
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

  songs = Object.seal({
    index: {},
  });

  includedFolders = Object.seal({
    folders: [],
  });

  playlists = Object.seal({
    playlists: [],
  });

  saveSongs() {
    writeFileSync(ProgramFiles.songsFile, JSON.stringify(this.songs));
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

    //For song file
    existsSync(ProgramFiles.songsFile)
      ? Object.entries(
          JSON.parse(readFileSync(ProgramFiles.songsFile))
        ).forEach(([key, val]) => (this.songs[key] = val))
      : this.saveSongs();

    //For folder file
    existsSync(ProgramFiles.includedfoldersFile)
      ? Object.entries(
          JSON.parse(readFileSync(ProgramFiles.includedfoldersFile))
        ).forEach(([key, val]) => (this.includedFolders[key] = val))
      : this.saveIncludedFolders();
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
