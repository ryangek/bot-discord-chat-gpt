# Use a lightweight base image with Node.js 16.9.0
FROM node:16.9.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install --production --ignore-scripts

# Copy the rest of the application code to the container
COPY . .

# Run the Node.js application using PM2
CMD ["pm2-runtime", "start", "index.js", "--no-daemon"]