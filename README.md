# Possible Debezium Outbox Bug with Protobuf and Pulsar

This repository demonstrates a potential bug encountered when streaming Protobuf payloads using Debezium with Pulsar and PostgreSQL with the outbox event router.

## Issue Description

The Pulsar consumer cannot deserialize the Protobuf message without removing quotation marks (") from the payload. These extra quotation marks surround the actual byte payload, requiring them to be removed before deserialization.

## Reproduction Steps

- Install dependencies: `npm install`, `go mod tidy`
- Run Docker Compose to start PostgreSQL, Pulsar, and Debezium server: `docker compose up -d`
- Start the API: `go run api/main.go`
- Start the consumer: `npm run dev`
- Send a POST request to the API:
    ```sh
    curl --request POST \
      --url http://localhost:8080/product \
      --header 'Content-Type: application/json' \
      --data '{
      "name": "Test",
      "description": "vehicle",
      "price": 10.0
    }'
    ```
- (Optional) A commented-out line demonstrates a workaround that seems to resolve the issue, but further investigation is needed.

## Configs
- Pulsar version: `apachepulsar/pulsar:3.2.2`
- Debezium version: `debezium/server:2.6.1.Final` with config:

      ```conf
      debezium.sink.type=pulsar
      debezium.sink.pulsar.client.serviceUrl=pulsar://pulsar:6650
      debezium.source.connector.class=io.debezium.connector.postgresql.PostgresConnector
      debezium.source.offset.storage.file.filename=/tmp/offsets.dat
      debezium.source.offset.flush.interval.ms=0
      debezium.source.database.hostname=postgres
      debezium.source.database.port=5432
      debezium.source.database.user=test
      debezium.source.database.password=test
      debezium.source.database.dbname=store
      debezium.source.database.server.name=postgres
      debezium.source.schema.include.list=public
      debezium.source.table.include.list=public.outbox_events
      debezium.source.plugin.name=pgoutput
      debezium.source.slot.name=store_cdc
      debezium.source.heartbeat.interval.ms=4000
      debezium.source.topic.prefix=example
      debezium.source.schema.whitelist=public
      debezium.connector.postgres=DEBUG, stdout
      debezium.transforms=outbox
      debezium.transforms.outbox.type=io.debezium.transforms.outbox.EventRouter
      debezium.value.converter=io.debezium.converters.BinaryDataConverter
      debezium.value.converter.delegate.converter.type=org.apache.kafka.connect.json.JsonConverter
      debezium.value.converter.delegate.converter.type.schemas.enable=false
      debezium.format.value.converter.schemas.enable=false
      debezium.format.key.converter.schemas.enable=false
      debezium.format.value.schemas.enable=false
      debezium.source.binary.handling.mode=hex
      ```

