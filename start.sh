#!/bin/bash
# Infinite loop to restart the bot in case of exit
while true; do
  echo "Starting the bot..."
  node index.js  # Pastikan file utama bot adalah index.js
  
  EXIT_CODE=$?
  echo "Bot exited with code: $EXIT_CODE"
  
  if [ $EXIT_CODE -ne 0 ]; then
    echo "Restarting bot due to error..."
  else
    echo "Bot exited normally. Restarting..."
  fi
  
  sleep 5  # Optional: Add a delay before restarting
done
