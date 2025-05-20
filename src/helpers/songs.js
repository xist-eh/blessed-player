import { existsSync, statSync, readdirSync } from "fs";
import path from "path";
import { parseFile } from "music-metadata";
import { MixPlayer } from "mix-player";

import { ProgramFiles } from "./files.js";

const SongsUtility = (() => {
  const supportedSongExtensions = [".mp4", ".mp3", ".wav"];

  let songsQueue = [];
  let currentPlaylist = ProgramFiles.playlists.all.slice();

  let rootFolders = [];

  const indexFolder = async (dir, recurse) => {
    if (ProgramFiles.includedFolders.folders.includes(dir)) {
      return;
    }
    ProgramFiles.includedFolders.folders.push(dir);

    for (const item of readdirSync(dir)) {
      const itemPath = path.format({ dir: dir, base: item });
      if (supportedSongExtensions.includes(path.extname(item))) {
        ProgramFiles.playlists.all.push(itemPath);
        const metadata = await parseFile(itemPath);

        ProgramFiles.songsInfo[itemPath] = {
          duration: Math.round(metadata.format.duration),
          trackName: metadata.common.title,
          artist: metadata.common.albumartist,
        };
      } else if (recurse && statSync(itemPath).isDirectory()) {
        indexFolder(itemPath, true);
      }
    }
  };

  const factory = {
    init: () => {},
    getSongInfo: (filePath) => {
      const data = ProgramFiles.songsInfo[filePath];
      return {
        trackName: data.trackName,
        duration: data.duration,
        artist: data.artist,
      };
    },
    findSongFromCurrentPlaylist: (searchQuery) => {},
    playSong: (filePath) => {
      MixPlayer.play(filePath);
    },
    addRootFolder: async (folderPath, recursiveSearch) => {
      folderPath = path.resolve(folderPath);

      if (!statSync(folderPath).isDirectory()) {
        throw new Error("Directory does not exist!");
      }

      await indexFolder(folderPath, recursiveSearch);

      ProgramFiles.saveIncludedFolders();
      ProgramFiles.savePlaylists();
      ProgramFiles.saveSongsInfo();

      return;
    },
    getRootFolders: () => rootFolders,
    getSongsQueue: () => songsQueue,
    getCurrentPlaylist: () => currentPlaylist,
  };

  return factory;
})();

export { SongsUtility };
