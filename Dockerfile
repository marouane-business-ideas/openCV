FROM node:22.6.0

# Set the working directory
WORKDIR /app

# Copy the entire project
COPY . .

# Copy the frontend package.json and package-lock.json
# COPY package*.json ./

# Install project dependencies
RUN apt-get update && apt-get install -y chromium
RUN npm install

# Set Puppeteer to use the system-installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install frontend and backend dependencies
RUN npm run install:all

# Clean up unnecessary files (optional)
RUN npm cache clean --force

# Expose frontend's port
EXPOSE 5173
# Expose backend's port
EXPOSE 1337

# Start both frontend and backend
CMD ["npm", "run", "dev"]
