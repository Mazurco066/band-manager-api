# Development enviroment
FROM node:16-alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

# RUN npm i -g yarn

# Install Puppeteer dependencies
RUN apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

# Configure Puppeteer to run in non-headless mode
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"

RUN yarn install

COPY . .

RUN yarn build

# Production setup
FROM node:alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

# RUN npm i -g yarn

RUN yarn install --prod

# Install Puppeteer dependencies
RUN apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

# Configure Puppeteer to run in non-headless mode
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]