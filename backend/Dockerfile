# Use the official Node.js image as a base
FROM node:22.6.0

# Install Nginx
  RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Set the working directory
  WORKDIR /app

# Copy the entire project
  COPY . .

# Install project dependencies
  RUN npm install

# Clean up unnecessary files (optional)
RUN npm cache clean --force

# Copy Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for Nginx
EXPOSE 1337

# Start Nginx and your Node.js aprun preview
CMD nginx -g 'daemon off;' & npm run build & npm run start