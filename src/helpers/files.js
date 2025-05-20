import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { createHash } from "crypto";
import path from "path";

const ProgramFiles = (() => {
  const PrefsFile = path.resolve("./config/prefs.json");
  const SongsInfoFile = path.resolve("./config/songs-info.json");
  const IncludedFoldersFile = path.resolve("./config/included-folders.json");
  const PlaylistsFile = path.resolve("./config/playlists.json");

  if (!existsSync("./config")) {
    mkdirSync("./config");
  }

  const factory = {
    //Initialize prefs with default value
    prefs: Object.seal({
      recursiveFolderSearch: true,
      namePattern: "{artist} - {name}",
      ui: {
        primaryColor: "#89CFF0",
        secondaryColor: "#088F8F",
        bgColor: "#7393B3",
      },
    }),

    includedFolders: Object.seal({
      folders: [],
    }),

    songsInfo: {},

    playlists: Object.seal({
      all: [],
      user: {},
    }),

    saveSongsInfo() {
      writeFileSync(SongsInfoFile, JSON.stringify(this.songsInfo));
    },

    savePrefs() {
      writeFileSync(PrefsFile, JSON.stringify(this.prefs));
    },
    saveIncludedFolders() {
      writeFileSync(IncludedFoldersFile, JSON.stringify(this.includedFolders));
    },
    savePlaylists() {
      writeFileSync(PlaylistsFile, JSON.stringify(this.playlists));
    },
  };

  //For prefs file
  existsSync(PrefsFile)
    ? Object.entries(JSON.parse(readFileSync(PrefsFile))).forEach(
        ([key, val]) => (factory.prefs[key] = val)
      )
    : factory.savePrefs();

  //For included folders file
  existsSync(IncludedFoldersFile)
    ? Object.entries(JSON.parse(readFileSync(IncludedFoldersFile))).forEach(
        ([key, val]) => (factory.includedFolders[key] = val)
      )
    : factory.saveIncludedFolders();

  //For songs info file
  existsSync(SongsInfoFile)
    ? Object.entries(JSON.parse(readFileSync(SongsInfoFile))).forEach(
        ([key, val]) => (factory.songsInfo[key] = val)
      )
    : factory.saveSongsInfo();
  //For playlists file
  existsSync(PlaylistsFile)
    ? Object.entries(JSON.parse(readFileSync(PlaylistsFile))).forEach(
        ([key, val]) => (factory.playlists[key] = val)
      )
    : factory.savePlaylists();

  return factory;
})();

// class ProgramFiles {
//   static prefsFile = path.resolve("./config/prefs.json");
//   static indexFile = path.resolve("./config/index.json");
//   static includedfoldersFile = path.resolve("./config/included-folders.json");
//   static playlistsFile = path.resolve("./config/playlists.json");

//   prefs = Object.seal({
//     recursiveFolderSearch: true,
//     namePattern: "{artist} - {name}",
//     ui: {
//       primaryColor: "#89CFF0",
//       secondaryColor: "#088F8F",
//       bgColor: "#7393B3",
//     },
//   });

//   includedFolders = Object.seal({
//     folders: [],
//   });

//   songsIndex = {};

//   playlists = Object.seal({
//     all: [],
//     user: {},
//   });

//   saveIndex() {
//     writeFileSync(ProgramFiles.indexFile, JSON.stringify(this.songsIndex));
//   }

//   savePrefs() {
//     writeFileSync(ProgramFiles.prefsFile, JSON.stringify(this.prefs));
//   }
//   saveIncludedFolders() {
//     writeFileSync(
//       ProgramFiles.includedfoldersFile,
//       JSON.stringify(this.includedFolders)
//     );
//   }
//   savePlaylists() {
//     writeFileSync(ProgramFiles.playlistsFile, JSON.stringify(this.playlists));
//   }

//   constructor() {
//     //Singleton
//     if (ProgramFiles._instance) {
//       throw new Error("New Instance of ProgramFiles class cannot be created!");
//     }
//     ProgramFiles._instance = this;

//     //Fetch or create config of program files

//     //For prefs file
//     existsSync(ProgramFiles.prefsFile)
//       ? Object.entries(
//           JSON.parse(readFileSync(ProgramFiles.prefsFile))
//         ).forEach(([key, val]) => (this.prefs[key] = val))
//       : this.savePrefs();

//     //For index file

//     //For folder file
//     existsSync(ProgramFiles.includedfoldersFile)
//       ? Object.entries(
//           JSON.parse(readFileSync(ProgramFiles.indexFile))
//         ).forEach(([key, val]) => (this.songsIndex[key] = val))
//       : this.saveIndex();
//     //For playlists file
//     existsSync(ProgramFiles.playlistsFile)
//       ? Object.entries(
//           JSON.parse(readFileSync(ProgramFiles.playlistsFile))
//         ).forEach(([key, val]) => (this.playlists[key] = val))
//       : this.savePlaylists();
//   }
// }

// const ProgramFilesInstance = new ProgramFiles();

export { ProgramFiles };
