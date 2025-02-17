# Use official Node.js image
FROM node:20.17.0
# Set working directory
WORKDIR /app
# Copy package.json and install dependencies
COPY package.json ./
RUN npm install
# Copy the rest of the application
COPY . .
# Expose the port your app runs on
EXPOSE 2000
# Command to run the app
CMD ["node", "server.js"]