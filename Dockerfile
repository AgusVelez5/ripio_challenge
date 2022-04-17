FROM mhart/alpine-node:12 as build-stage

WORKDIR /app

COPY ./ /app/

RUN npm ci \
  && npm cache clean --force \
  && mv /app/node_modules /node_modules

RUN npx hardhat compile

FROM mhart/alpine-node:slim-12 

WORKDIR /app

COPY --from=build-stage /app .

ENV PORT 3000

EXPOSE 3000

CMD npm start