# Base image
FROM node:18-alpine as builder

# Install pnpm
RUN npm install -g pnpm@8.7.1

# Create app directory
WORKDIR /app

# copy all project contents, including source code
COPY . ./

# Install app dependencies
RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM node:18-alpine as runner

ENV NODE_ENV production

RUN npm install -g pnpm@8.7.1

WORKDIR /app

# download prod deps
COPY --from=builder app/package.json app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# copy build artifacts
COPY --from=builder app/dist ./dist

# Start the server using the production build
CMD [ "node", "./dist/src/main.js" ]
