import { existsSync, statSync, readdirSync } from "fs";
import path from "path";
import { parseFile } from "music-metadata";
import { MixPlayer } from "mix-player";

import { ProgramFiles } from "./files.js";

class SongsUtility {
  static supportedSongExtensions = [".mp4", ".mp3", ".wav", ".m4a"];
  songsQueue;
  rightView;

  playSong(index) {
    MixPlayer.play(index);
    this.rightView.setCurrentSong(ProgramFiles.songs.index[index].trackName);
  }

  async recursiveRoot(dir, recurse = true) {
    if (ProgramFiles.includedFolders.folders.includes(dir)) {
      return;
    }
    ProgramFiles.includedFolders.folders.push(dir);

    for (const item of readdirSync(dir)) {
      const itemPath = path.format({ dir: dir, base: item });
      if (SongsUtility.supportedSongExtensions.includes(path.extname(item))) {
        await this.indexSong(itemPath);
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
    ProgramFiles.saveSongs();

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
          ProgramFiles.songs.index[itemPath] === undefined
        ) {
          ProgramFiles.playlists.all.push(
            path.win32.basename(itemPath, path.extname(itemPath))
          );
        }
      }
    }

    MixPlayer;
  }
}

const SongsUtilityInstance = new SongsUtility();

export { SongsUtilityInstance as SongsUtility };
