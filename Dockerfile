FROM node:20.9 as build
WORKDIR /app
COPY . .
RUN npm i && npm run build
FROM nginx:1.25.3
COPY --from=build /app/out /usr/share/nginx/html
COPY ./nginx.conf /etc/ngnix/nginx.conf

