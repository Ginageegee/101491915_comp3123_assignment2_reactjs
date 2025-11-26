FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install --production

# Copy the rest of the backend code
COPY . .

# Expose backend port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
