# Use Node official image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the app in development mode (with hot reload)
CMD ["npm", "run", "dev"]
