-- init_data.sql - Datos iniciales para MP_DICRI
USE [MP_DICRI]
GO

PRINT '=== INICIANDO CARGA DE DATOS INICIALES ==='
GO

------------------------------------------------
-- 1) INSERTAR ROLES
------------------------------------------------
PRINT 'Insertando roles...'
IF NOT EXISTS (SELECT 1 FROM Roles)
BEGIN
    INSERT INTO Roles (NombreRol, Descripcion)
    VALUES
        ('ADMIN',       'Administrador del sistema'),
        ('TECNICO',     'Técnico encargado de registrar expedientes e indicios'),
        ('COORDINADOR', 'Coordinador que supervisa expedientes');
    
    PRINT '✓ Roles insertados correctamente'
END
ELSE
BEGIN
    PRINT '✓ Roles ya existen, omitiendo inserción'
END
GO

------------------------------------------------
-- 2) INSERTAR ESTADOS DE EXPEDIENTE
------------------------------------------------
PRINT 'Insertando estados de expediente...'

IF NOT EXISTS (SELECT 1 FROM EstadosExpediente WHERE NombreEstado = 'REGISTRADO')
BEGIN
    INSERT INTO EstadosExpediente (NombreEstado, Descripcion) 
    VALUES('REGISTRADO', 'Expediente Registrado');
    PRINT '✓ Estado REGISTRADO insertado'
END

IF NOT EXISTS (SELECT 1 FROM EstadosExpediente WHERE NombreEstado = 'EN_REVISION')
BEGIN
    INSERT INTO EstadosExpediente (NombreEstado, Descripcion) 
    VALUES('EN_REVISION', 'Expediente en Revision');
    PRINT '✓ Estado EN_REVISION insertado'
END

IF NOT EXISTS (SELECT 1 FROM EstadosExpediente WHERE NombreEstado = 'APROBADO')
BEGIN
    INSERT INTO EstadosExpediente (NombreEstado, Descripcion) 
    VALUES('APROBADO', 'Expediente Aprobado');
    PRINT '✓ Estado APROBADO insertado'
END

IF NOT EXISTS (SELECT 1 FROM EstadosExpediente WHERE NombreEstado = 'RECHAZADO')
BEGIN
    INSERT INTO EstadosExpediente (NombreEstado, Descripcion) 
    VALUES('RECHAZADO', 'Expediente Rechazado');
    PRINT '✓ Estado RECHAZADO insertado'
END
GO

------------------------------------------------
-- 3) INSERTAR USUARIO ADMIN
------------------------------------------------
PRINT 'Insertando usuario administrador...'
IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE UsuarioLogin = 'admin')
BEGIN
    INSERT INTO Usuarios (
        NombreCompleto,
        UsuarioLogin,
        ContraseniaHash,
        Correo,
        IdRol,
        Activo,
        FechaCreacion
    )
    VALUES (
        'Administrador General',
        'admin',
         CONVERT(varbinary(256), '$2b$10$CEtPd6uV52pThlCj6aNbhufqbA.6FpicYXyHoSIFeJBwz/jZ9DOAW'),
        'admin@mpdicri.local',
        (SELECT IdRol FROM Roles WHERE NombreRol = 'ADMIN'),
        1,
        GETDATE()
    );
    PRINT '✓ Usuario admin insertado correctamente'
END
ELSE
BEGIN
    PRINT '✓ Usuario admin ya existe, omitiendo inserción'
END
GO

PRINT '=== CARGA DE DATOS INICIALES COMPLETADA ==='
GO