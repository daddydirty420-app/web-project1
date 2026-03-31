import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Dockerと本番は環境変数が直接渡ってくるのでスキップ
if (!process.env.DOCKER && process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local" });
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set!");
}

const isSSL = process.env.DB_SSL === "true";

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  logging: false,
  dialectOptions: isSSL
  ? {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  }
  : {},
});

export default sequelize;