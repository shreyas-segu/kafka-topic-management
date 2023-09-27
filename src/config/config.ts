import { KafkaConfig, SASLOptions } from 'kafkajs';

const username = process.env.KAFKA_USERNAME || '';
const password = process.env.KAFKA_PASSWORD || '';
const brokers = process.env.KAFKA_URL ? process.env.KAFKA_URL.split(',') : [];

export const env = process.env.NODE_ENV || 'local';

if (!brokers.length) {
  throw new Error('Config: Missing Kafka Brokers URLs');
}

const saslOptions: SASLOptions = {
  mechanism: 'scram-sha-512',
  username,
  password,
};

export const KafkaConnectionConfig: KafkaConfig =
  env === 'local'
    ? {
        clientId: 'admin-script',
        brokers: brokers,
      }
    : {
        clientId: 'admin-script',
        brokers: brokers,
        sasl: saslOptions,
      };
