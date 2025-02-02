import { DataSource } from "typeorm";
import dotenv from "dotenv"
dotenv.config()
// todo при хостинге уже надо иметь готовую базу со всеми таблицами
// typeorm создвать не будет, так как synchronize false
// для хостинга просто вытащить все таблицы, которые уже созданы
export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE,
  url: process.env.DB_CONNECT_URL,
  // заменить на фолс
  synchronize: false,
  logging: false,
  entities: [__dirname + '/../../../**/*.entity.{js,ts}'],
  subscribers: [],
})