FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Set environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ingrowwth_db?schema=public"
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_ZGVzdGluZWQtZG9nLTEyLmNsZXJrLmFjY291bnRzLmRldiQ"
ENV CLERK_SECRET_KEY="sk_test_s4Tld4bYLYK7lXsK6qMljzLeeyBh2r5unTQ8eSVhiU"

# Build the Next.js application
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "start"]