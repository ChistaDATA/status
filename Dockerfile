FROM nginxinc/nginx-unprivileged

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.d/40-portal-ui-entrypoint.sh

COPY build /usr/share/nginx/html
