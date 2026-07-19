FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Expose the port Next.js runs on
EXPOSE 3000

# Start in dev mode, binding to all interfaces so Docker port-mapping works
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]
