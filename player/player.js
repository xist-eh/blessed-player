import { createRequire } from "module";

const mixerPlayer = createRequire(import.meta.url)(
  "./build/Release/mixer-player"
);

export { mixerPlayer as player };
