#!/bin/bash
# Auto-rebuild graphify graph on code changes
# Run: bash .graphify-watch.sh
cd "$(dirname "$0")"
echo "Watching ~/projects/cupslog for changes..."
graphify /home/yan/projects/cupslog --watch --obsidian --obsidian-dir "/home/yan/Documents/Obsidian Vault/CupsLog"
