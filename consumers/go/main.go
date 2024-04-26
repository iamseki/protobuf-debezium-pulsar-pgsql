package main

import (
	"context"
	"encoding/hex"
	"fmt"
	"log"
	"strings"

	"github.com/apache/pulsar-client-go/pulsar"
	products "github.com/iamseki/protobuf-debezium-pulsar/gen/go/store/v1"
	"google.golang.org/protobuf/proto"
)

func main() {
	client, err := pulsar.NewClient(pulsar.ClientOptions{
		URL: "pulsar://localhost:6650",
	})
	if err != nil {
		log.Fatal(err)
	}

	consumer, err := client.Subscribe(pulsar.ConsumerOptions{
		Topic:            "persistent://public/default/outbox.event.INSERTED",
		SubscriptionName: "go-subscription",
		Type:             pulsar.Shared,
	})
	if err != nil {
		log.Fatal(err)
	}
	defer consumer.Close()

	for i := 0; i < 10; i++ {
		// may block here
		fmt.Println("trying to consume msg...")
		msg, err := consumer.Receive(context.Background())
		if err != nil {
			log.Fatal(err)
		}

		fmt.Printf("Received message msgId: %#v -- content: '%s'\n",
			msg.ID(), string(msg.Payload()))

		product := &products.Product{}
		payloadStr := strings.ReplaceAll(string(msg.Payload()), "\"", "")
		decodedPayload, err := hex.DecodeString(payloadStr)
		if err != nil {
			log.Printf("DecodedStringHex proto error: %v", err)
			consumer.Ack(msg)
			continue
		}
		err = proto.Unmarshal(decodedPayload, product)
		if err != nil {
			log.Printf("Unmarshal proto error: %v", err)
			consumer.Ack(msg)
			continue
		}

		fmt.Printf("Deserialized proto msgId: %#v -- content: '%s'\n",
			msg.ID(), product)
		consumer.Ack(msg)
	}

	if err := consumer.Unsubscribe(); err != nil {
		log.Fatal(err)
	}

	defer client.Close()
}
