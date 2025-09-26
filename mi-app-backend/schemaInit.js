import { getConnection, sql } from './dbConfig.js';

export async function initSchema() {
    const pool = await getConnection();
    if (!pool) {
        console.error('initSchema: conexión a DB no disponible. Saltando creación de esquema.');
        return;
    }

    const createTableTsql = `
    IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Productos]') AND type in (N'U'))
    BEGIN
        CREATE TABLE [dbo].[Productos](
            [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
            [nombre] NVARCHAR(255) NOT NULL,
            [descripcion] NVARCHAR(MAX) NULL,
            [precio] DECIMAL(10,2) NOT NULL,
            [stock] INT NOT NULL CONSTRAINT DF_Productos_stock DEFAULT(0),
            [createdAt] DATETIME2 NOT NULL CONSTRAINT DF_Productos_createdAt DEFAULT (SYSUTCDATETIME())
        );
    END;

    IF NOT EXISTS (
        SELECT 1 FROM sys.indexes WHERE name = N'UQ_Productos_nombre' AND object_id = OBJECT_ID(N'[dbo].[Productos]')
    )
    BEGIN
        CREATE UNIQUE INDEX UQ_Productos_nombre ON [dbo].[Productos]([nombre]);
    END;
    `;

    try {
        await pool.request().batch(createTableTsql);
        console.log('Esquema verificado: tabla Productos disponible.');
    } catch (error) {
        console.error('Error al inicializar esquema:', error);
        // Re-lanzamos para que el arranque pueda decidir si continuar o no
        throw error;
    }
}


