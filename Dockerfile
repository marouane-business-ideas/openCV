# Use the official Node.js image as a base
FROM node:22.6.0

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends

# Install Nginx
  RUN apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Set the working directory
  WORKDIR /app

# Copy the entire project
  COPY . .

# Install project dependencies
  RUN npm install

# Set Puppeteer to use the system-installed Chrome
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Install frontend and backend dependencies
RUN npm run install:all

# Clean up unnecessary files (optional)
RUN npm cache clean --force

# Copy Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx and your Node.js aprun preview
CMD nginx -g 'daemon off;' & npm run preview