FROM golang as build

WORKDIR /app

ADD . .

RUN CGO_ENABLED=0 GOOS=linux go build -o backend


# FROM stretch as production
FROM alpine as production

COPY --from=build /app/backend .
COPY --from=build /app/uploads ./uploads

# RUN apk add tzdata

ENV TZ=Asia/Bangkok

CMD ["/backend"]
