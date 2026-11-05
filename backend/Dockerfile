FROM node:24-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
RUN npm ci

COPY tsconfig.base.json ./tsconfig.base.json
COPY backend ./backend
RUN npm run build --workspace=@site/backend

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
RUN npm ci --omit=dev

COPY --from=build /app/backend/dist ./backend/dist

EXPOSE 3000
CMD ["node", "backend/dist/index.js"]
