# blessed-player

A sleek, terminal-based music player built with [blessed](https://github.com/chjj/blessed) JavaScript library.

## Features

- 🎵 Play, pause, and skip audio files
- 📂 Browse and manage your music library
- 🔄 Create and manage playlists
- 🎛️ Interactive terminal UI with keyboard shortcuts
- 🎚️ Volume control and equalizer
- 🔍 Search functionality
- 🌈 Customizable themes

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/blessed-player.git

# Navigate to the project directory
cd blessed-player

# Install dependencies
npm install

# Run the player
make run
```

## Usage

```bash
# Start the player
npm run

Keybinds:
 - o: open music directory
 - q: quit
```

### Keyboard Shortcuts

- `Space` - Play/Pause
- `Right/Left` - Seek forward/backward
- `n` - Next track
- `p` - Previous track
- `+/-` - Volume up/down
- `q` - Quit

## Dependencies

- [blessed](https://github.com/chjj/blessed) - Terminal interface library
- [node-mpv](https://github.com/00SteinsGate00/Node-MPV) - MPV bindings for Node.js
- [music-metadata](https://github.com/borewit/music-metadata) - Music metadata parser

## Screenshots

![Main Interface](screenshots/main.png)
![Library View](screenshots/library.png)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
