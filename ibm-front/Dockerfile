# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:14.19.3-slim as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine
#Copy ci-dashboard-dist
COPY --from=build-stage /app/dist /usr/share/nginx/html
#Copy default nginx configuration
COPY ./nginx/conf.d /etc/nginx/conf.d
EXPOSE 8080