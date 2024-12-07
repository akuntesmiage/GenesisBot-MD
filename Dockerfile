# Use Node.js version 18.18.0 based on Debian Buster
FROM node:18.18.0-buster

# Update repositories, install dependencies, and clean cache
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json first
COPY package.json ./ 

# Copy package-lock.json if available
COPY package-lock.json* ./ 

# Install Node.js dependencies, ignoring engine constraints and warnings
RUN npm config set engine-strict false && npm install --legacy-peer-deps

# Copy all files to the container
COPY . . 

# Expose port 5000 for your app
EXPOSE 5000

# Copy the start script and make it executable
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Run the start script
CMD ["/app/start.sh"]
