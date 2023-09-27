import { Admin, ITopicConfig } from 'kafkajs';

export type Topic = {
  name: string;
  partitions: number;
  replicationFactor: number;
};

export async function listTopics(kafkaAdmin: Admin): Promise<string[]> {
  const topics = await kafkaAdmin.listTopics();
  const metadata = await kafkaAdmin.fetchTopicMetadata({ topics });
  console.log(metadata);
  return topics;
}

export async function createTopics(
  topicsToCreate: Topic[],
  kafkaAdmin: Admin,
): Promise<boolean> {
  return await kafkaAdmin.createTopics({
    topics: topicsToCreate.map<ITopicConfig>((topic) => ({
      topic: topic.name,
      numPartitions: topic.partitions,
      replicationFactor: topic.replicationFactor,
      configEntries: [{ name: 'min.insync.replicas', value: '2' }],
    })),
  });
}

export async function deleteTopics(
  topicsToDelete: string[],
  kafkaAdmin: Admin,
): Promise<void> {
  return await kafkaAdmin.deleteTopics({ topics: topicsToDelete });
}
