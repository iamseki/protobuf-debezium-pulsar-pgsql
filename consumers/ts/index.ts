import { Product } from '../../gen/ts/store/v1/products'
import * as Pulsar from 'pulsar-client'

const run = async () => {
  const client = new Pulsar.Client({
    serviceUrl: 'pulsar://localhost:6650',
  });

  const consumer = await client.subscribe({
    topic: 'persistent://public/default/outbox.event.INSERTED',
    subscription: 'ts-subscription',
    subscriptionType: 'Shared'
  });

  for (let i = 0; i < 10; i++) {
    console.log(`trying to consume msg...`);
    const msg = await consumer.receive();

    try {
      consumer.acknowledge(msg);
      const payload = msg.getData();

      console.log(`get Data: ${msg.getData()}`)
      console.log(`to string: ${msg.getData().toString()}`)
      console.log(`to replaced ": ${(msg.getData().toString() as any).replaceAll('"', '')}`)
      //const hexString = (msg.getData().toString() as any).replaceAll('"', '');
      const decodedMsg = Buffer.from((msg.getData().toString() as any).replaceAll('"', ''), 'hex');

      console.log(`received msgId: ${msg.getMessageId()}, contentPayload: ${payload}`);
      console.log(`received msgId: ${msg.getMessageId()}, decodedMsg: ${decodedMsg}`);

      // I which I could use directly msg.getData() like this:
      const product = Product.fromBinary(msg.getData());
      // but just work with this:
      //const product = Product.fromBinary(decodedMsg);
      
      console.log(`msgId: ${msg.getMessageId()}, payload: ${JSON.stringify(product)}`);
    } catch (e) {
      console.log(`nack msg: ${msg.getMessageId()}`)
      consumer.negativeAcknowledge(msg)
      console.error(e)
    }
  }

  await consumer.close();
  await client.close();
};

run();