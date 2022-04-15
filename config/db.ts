import pg from "pg";
import { Sequelize } from "sequelize";

const Pool = pg.Pool;

export const pool = new Pool({
  user: "postgres",
  password: process.env.PSQL_PASSWORD,
  host: "localhost",
  port: 5432,
  database: "review",
});

const dbSequelise = new Sequelize(
  process.env.PSQL_DATABASE || "",
  process.env.PSQL_USERNAME || "",
  process.env.PSQL_PASSWORD,
  {
    host: process.env.HOST,
    dialect: "postgres",
  }
);

/**
 * On server s/u checks and logs if the connection
 * to the database was successfull, else log the error
 */
(async function () {
  try {
    await dbSequelise.authenticate();
    console.log("DB Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export { dbSequelise };
