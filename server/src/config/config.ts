import dotenv from "dotenv";
import { Dialect } from "sequelize";

dotenv.config();

interface IConfig {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  port?: number;
  dialect: Dialect;
  use_env_variable?: string;
  dialectOptions?: {
    ssl?: boolean;
  };
}

interface IConfigEnv {
  development: IConfig;
  test: IConfig;
  production: IConfig;
}

const config: IConfigEnv = {
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
  },
  test: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: process.env.DB_SSL === "true",
    },
  },
};

export default config;
