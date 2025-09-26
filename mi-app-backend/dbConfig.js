import 'dotenv/config';
import sql from 'mssql';

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

async function getConnection() {
    try {
        return sql.connect(dbConfig);
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error;
    }
}

export { getConnection, sql };