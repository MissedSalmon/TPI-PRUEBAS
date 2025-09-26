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
        enableArithAbort: true,
        requestTimeout: 30000,
        connectionTimeout: 30000,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool;

async function getConnection() {
    try {
        if (!pool) {
            console.log('Creando nueva conexión a la base de datos...');
            pool = await sql.connect(dbConfig);
            console.log('Conexión a la base de datos establecida exitosamente');
        }
        return pool;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        console.error('Configuración de DB:', {
            server: dbConfig.server,
            database: dbConfig.database,
            user: dbConfig.user,
            hasPassword: !!dbConfig.password
        });
        // No lanzar el error inmediatamente, permitir que el servidor continúe
        // y manejar el error en los endpoints individuales
        return null;
    }
}

// Función para cerrar la conexión
async function closeConnection() {
    try {
        if (pool) {
            await pool.close();
            pool = null;
            console.log('Conexión a la base de datos cerrada');
        }
    } catch (error) {
        console.error('Error al cerrar la conexión:', error);
    }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
    console.log('Cerrando conexión a la base de datos...');
    await closeConnection();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Cerrando conexión a la base de datos...');
    await closeConnection();
    process.exit(0);
});

export { getConnection, sql, closeConnection };