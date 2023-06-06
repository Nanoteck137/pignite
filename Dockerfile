# Backend
FROM node:20-alpine as backend-build

WORKDIR /app/backend

COPY ./gotlett-backend/package*.json ./
RUN npm install

COPY ./gotlett-backend ./
RUN npm run build

# Frontend
FROM node:20-alpine as frontend-build

WORKDIR /app/frontend

COPY ./oshawott-frontend/package*.json ./
RUN npm install

COPY ./oshawott-frontend ./
RUN npm run build

# Deployment
FROM node:20-alpine 
ENV NODE_ENV=production

WORKDIR /app

COPY ./gotlett-backend/package*.json ./
COPY ./gotlett-backend/prisma ./

RUN npm ci --omit=dev

COPY --from=backend-build /app/backend/dist ./dist
COPY --from=frontend-build /app/frontend/dist ./public

RUN npx prisma generate 

EXPOSE 3000

CMD node dist/index.js
