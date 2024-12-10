import { existsSync, statSync, readdirSync } from "fs";
import path from "path";
import { parseFile } from "music-metadata";
import { MixPlayer } from "mix-player";

import { ProgramFiles } from "./files.js";

class SongsUtility {
  static supportedSongExtensions = [".mp4", ".mp3", ".wav"];
  songsQueue;
  uiSetCurrentSong;
  currentSongsList;

  getIndexedSongInfo(filePath) {
    return ProgramFiles.songsIndex[filePath]
      ? {
          trackName: ProgramFiles.songsIndex[filePath].trackName,
          artist: ProgramFiles.songsIndex[filePath].artist,
          duration: ProgramFiles.songsIndex[filePath].duration,
        }
      : null;
  }

  async getSongInfo(filePath) {
    const metadata = await parseFile(filePath);
    return {
      duration: Math.round(metadata.format.duration),
      trackName: metadata.common.title,
      artist: metadata.common.albumartist,
    };
  }

  playSong(index) {
    MixPlayer.play(index);
    this.getSongInfo(index).then((out) => {
      this.uiSetCurrentSong(out.trackName);
    });
  }

  async recursiveRoot(dir, recurse = true) {
    if (ProgramFiles.includedFolders.folders.includes(dir)) {
      return;
    }
    ProgramFiles.includedFolders.folders.push(dir);

    for (const item of readdirSync(dir)) {
      const itemPath = path.format({ dir: dir, base: item });
      if (SongsUtility.supportedSongExtensions.includes(path.extname(item))) {
        ProgramFiles.playlists.all.push(itemPath);

        ProgramFiles.songsIndex[itemPath] = await this.getSongInfo(itemPath);
      } else if (recurse && statSync(itemPath).isDirectory()) {
        this.recursiveRoot(itemPath);
      }
    }
  }
  async addRootFolder(dir) {
    dir = path.resolve(dir);

    if (!statSync(dir).isDirectory()) {
      throw new Error("Directory has not been added!");
    }

    if (ProgramFiles.prefs.recursiveFolderSearch !== true) {
      await this.recursiveRoot(dir, false);
    } else {
      await this.recursiveRoot(dir);
    }
    ProgramFiles.saveIncludedFolders();
    ProgramFiles.savePlaylists();
    ProgramFiles.saveIndex();

    return;
  }
  getRootFolders() {
    return ProgramFiles.includedFolders.folders;
  }
  constructor() {
    if (SongsUtility._instance) {
      throw new Error("New Instance of SongsUtility cannot be created!");
    }
    SongsUtility._instance = this;
  }
  async init() {
    for (const folder of ProgramFiles.includedFolders.folders) {
      for (const item of readdirSync(folder)) {
        const itemPath = path.format({ base: item, dir: folder });
        if (
          SongsUtility.supportedSongExtensions.includes(path.extname(item)) &&
          ProgramFiles.songsIndex[itemPath] === undefined
        ) {
          ProgramFiles.playlists.all.push(itemPath);
          ProgramFiles.songsIndex[itemPath] = await this.getSongInfo(itemPath);
        }
      }
    }
    ProgramFiles.savePlaylists();
    ProgramFiles.saveIndex();

    this.currentSongsList = ProgramFiles.playlists.all;
  }
}

const SongsUtilityInstance = new SongsUtility();

export { SongsUtilityInstance as SongsUtility };
