import { Sequelize } from "sequelize";


const db = new Sequelize('students', 'root', '', {
    host: "localhost",
    dialect: "mysql"

})

export default db;