import { Sequelize } from "sequelize";

const db = new Sequelize('students', 'root', '', {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    logging: false, // Disable SQL query logging for cleaner console output
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    retry: {
        max: 3
    }
});

// Test connection function
export const testConnection = async () => {
    try {
        await db.authenticate();
        console.log('✅ Database connection established successfully.');
        return true;
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);
        return false;
    }
};

export default db;