FROM nginx:1.16.0-alpine
COPY ./build /usr/share/nginx/html
COPY ./dev.unicreate.ru ./
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]