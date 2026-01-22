#!/bin/bash

# Delete all 'lyrics' folders from contestants directories
find data -type d -name 'lyrics' -exec rm -rf {} + 2>/dev/null

echo "Deleted all 'lyrics' folders from contestants directories"
