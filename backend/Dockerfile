# Using Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install the required dependencies
RUN npm install

# Copy the application files
COPY . .

# Start the application in development mode using 'npm run dev'
CMD ["npm", "run", "dev"]
