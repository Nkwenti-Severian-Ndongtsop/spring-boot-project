FROM busybox:uclibc

WORKDIR /www

COPY . .

EXPOSE 80

CMD ["httpd", "-f", "-p", "80"]
