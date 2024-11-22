import { createRequire } from "module";

const mixPlayer = createRequire(import.meta.url)("./build/Release/mix-player");

export { mixPlayer };
