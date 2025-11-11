import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const isProd = process.env.NODE_ENV === "production";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set!");
}

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true
    },
  },
});

export default sequelize;