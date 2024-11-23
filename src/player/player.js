import { existsSync } from "fs";

import { createRequire } from "module";
import path from "path";

const mixPlayer = createRequire(import.meta.url)("./build/Release/mix-player");

function PlayerFactory() {
  let isPlaying = false;
  let autoPlay = true;
  let audioQueue = [];

  let loop = false;

  let callbackFns = [];

  const interval = setInterval(() => {
    if (!mixPlayer.hasAudioEnded()) {
      return;
    }

    if (factoryObject.getTrackDuration() > 1 && isPlaying) {
      console.log(isPlaying);
      callbackFns.forEach((fn) => fn());
    }

    if (loop) {
      audioQueue.splice(1, 0, audioQueue.at(0));
    }
    audioQueue.shift();
    if (audioQueue.length === 0) {
      isPlaying = false;
      return;
    }

    if ((autoPlay || loop) && isPlaying) {
      factoryObject.play();
    }
  }, 500);

  const factoryObject = {
    destroy: () => {
      clearInterval(interval);
    },
    pushFileToQueue: (filePath) => {
      filePath = path.resolve(filePath);
      if (!existsSync(filePath)) {
        return;
      }
      audioQueue.push(filePath);
    },
    pause: () => {
      mixPlayer.pauseAudio();
      isPlaying = false;
    },
    play: () => {
      isPlaying = true;

      if (mixPlayer.hasAudioEnded() && audioQueue.length !== 0) {
        mixPlayer.playAudioFile(audioQueue.at(0));

        return;
      }
      mixPlayer.playAudio();
    },
    setTrackPosition: (pos) => {
      mixPlayer.setAudioPosition(pos);
    },
    getTrackDuration: () => {
      return mixPlayer.getAudioDuration();
    },
    loop: (bool) => {
      loop = bool;
    },
    onTrackEnd: (fn) => {
      callbackFns.push(fn);
    },
  };

  return factoryObject;
}

const instance = PlayerFactory();

export { instance as player };
