# Base Image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies (npm)
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app (if applicable)
RUN npm run build

# Expose the port and run the app
EXPOSE 3000
CMD ["npm", "run" "dev"]
