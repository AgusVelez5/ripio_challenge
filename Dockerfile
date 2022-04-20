FROM mhart/alpine-node:12
WORKDIR /app
COPY package*.json ./
RUN npm ci \
  && npm cache clean --force 
COPY . .

FROM mhart/alpine-node:slim-12 
WORKDIR /app
COPY --from=0 /app/ ./
EXPOSE 3000
CMD ["node", "./src/index.js"]