import { KafkaConnectionConfig } from './src/config/config';
import {
  createTopics,
  deleteTopics,
  listTopics,
} from './src/kakfa-apis/kafka-apis';

import { Kafka } from 'kafkajs';

const kafka = new Kafka(KafkaConnectionConfig);

console.log('Connecting to Kafka...');

const admin = kafka.admin();

console.log('Connected to Kafka');

const path = './topics.json';
const file = Bun.file(path);

admin.connect().then(async () => {
  console.log('3');

  const existingTopics = await listTopics(admin);

  console.log(`Topics from state: ${existingTopics}`);

  const data = await file.json();

  const topics: string[] = data.topics;

  const topicsToCreate = topics
    .filter((x) => !existingTopics.includes(x) && x !== '')
    .map((x) => ({ name: x, partitions: 3, replicationFactor: 3 }));

  console.log(`Topics to create: ${topicsToCreate.map((x) => x.name)}`);

  const topicsToDelete = existingTopics.filter(
    (x) =>
      !topics.includes(x) && !['_schemas', '__consumer_offsets'].includes(x),
  );

  console.log(`Topics to delete: ${topicsToDelete}`);

  if (topicsToCreate.length > 0) {
    const topicCreationResult = await createTopics(topicsToCreate, admin);
    if (topicCreationResult) {
      console.log('Topics created successfully');
    }
  }

  if (topicsToDelete.length > 0) {
    await deleteTopics(topicsToDelete, admin);
    console.log('Topics deleted successfully');
  }

  await admin.disconnect();
});
