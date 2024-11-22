import { createRequire } from "module";

const mixerPlayer_addon = createRequire(import.meta.url)(
  "./build/Release/audio-player"
);

export { mixerPlayer_addon };
