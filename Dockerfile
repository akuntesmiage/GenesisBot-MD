# Use Node.js LTS based on Debian Buster
FROM node:lts-buster

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

# Copy package.json and package-lock.json first (for caching npm install)
COPY package.json ./
COPY package-lock.json* ./

# Install Node.js dependencies
RUN npm install

# Copy all files to the container
COPY . .

# Make start.sh executable
RUN chmod +x start.sh

# Expose port 5000 for the app
EXPOSE 5000

# Run start.sh to handle bot restarts
CMD ["./start.sh"]
