#TODO: why do I need node?
FROM node:latest as build
# ARG REACT_APP_SERVICES_HOST=/services/m

WORKDIR /app

COPY package.json .

RUN npm install
COPY . ./
RUN npm run build


FROM nginx as prod
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html


FROM node:latest as dev
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
EXPOSE 80
CMD ["npm", "run", "start"]