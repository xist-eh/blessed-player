import { readdir, existsSync, statSync, readdirSync } from "fs";
import path from "path";
import { createHash } from "crypto";

import { parseFile } from "music-metadata";

import { ProgramFiles } from "./files.js";

class SongsUtility {
  static supportedSongExtensions = [".mp4", ".mp3", ".wav"];
  #songs = [];

  async indexSong(songPath) {
    const metadata = await parseFile(songPath);
    ProgramFiles.songs.songsIndex[
      createHash("md5").update(path.win32.basename(songPath)).digest("hex")
    ] = {
      path: songPath,
      duration: Math.round(metadata.format.duration),
      trackName: metadata.common.title,
    };
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
          !(
            createHash("md5")
              .update(path.win32.basename(itemPath))
              .digest("hex") in ProgramFiles.songs.songsIndex
          )
        ) {
          await this.indexSong(itemPath);
        }
      }
    }
    ProgramFiles.saveSongs();
  }
}

const SongsUtilityInstance = new SongsUtility();

export { SongsUtilityInstance as SongsUtility };
