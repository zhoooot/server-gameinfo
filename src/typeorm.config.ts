import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Party } from './entity/party';
import { Question } from './entity/question';
import { Option } from './entity/option';

export const dataSourceConfig: DataSourceOptions = {
  url: process.env.DATABASE_URL,
  type: 'postgres',
  entities: [Party, Question, Option],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
    pool: {
      max: 3,
      idleTimeoutMillis: 10000,
    },
  },
};

export const dataSource = new DataSource(dataSourceConfig);

export default dataSourceConfig;
