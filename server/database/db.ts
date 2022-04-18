import { Sequelize } from "sequelize";

const dbSequelise = new Sequelize(
  process.env.POSTGRES_DB || "",
  process.env.POSTGRES_USER || "",
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.PSQL_HOST,
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
    console.error("Unable to connect to the database: here here !", error);
  }
})();

export { dbSequelise };
