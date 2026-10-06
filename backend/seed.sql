-- ============================================================
-- SCRIPT DE DATOS DE PRUEBA (SEED) PARA MYSQL WORKBENCH
-- ============================================================

USE `soporte_tecnico_db`;

-- Limpieza preventiva
DELETE FROM `tickets_historialsolicitud`;
DELETE FROM `tickets_solicitud`;

-- Inserción de solicitudes iniciales
INSERT INTO `tickets_solicitud` (`id`, `titulo`, `descripcion`, `usuario_solicitante`, `categoria`, `prioridad`, `estado`, `fecha_creacion`, `fecha_actualizacion`) 
VALUES 
(1, 'Fallo en Impresora Principal del Piso 3', 'La impresora no responde y muestra error de atasco de papel recurrente.', 'Carlos Mendoza', 'Hardware', 'Media', 'Pendiente', NOW(6), NOW(6)),
(2, 'Solicitud de Licencia Visual Studio Code Pro', 'Se requiere licencia para el nuevo desarrollador frontend del equipo.', 'Ana María Gómez', 'Software', 'Baja', 'En progreso', NOW(6), NOW(6)),
(3, 'Caída de conexión en Servidor DB Principal', 'Interrupción imprevista de conexión MySQL en producción durante 5 minutos.', 'Roberto Silva', 'Red', 'Crítica', 'Resuelta', NOW(6), NOW(6)),
(4, 'Creación de usuario y correo para practicante', 'Crear correo corporativo y acceso a VPN para nuevo practicante de QA.', 'Laura Restrepo', 'Accesos', 'Alta', 'Pendiente', NOW(6), NOW(6)),
(5, 'Solicitud de monitor secundario cancelada', 'El colaborador informa que utilizará su pantalla laptop personal.', 'Juan Pérez', 'Hardware', 'Baja', 'Cancelada', NOW(6), NOW(6));

-- Inserción de historial inicial de auditoría
INSERT INTO `tickets_historialsolicitud` (`solicitud_id`, `estado_anterior`, `estado_nuevo`, `fecha_cambio`, `usuario_responsable`, `observacion`) 
VALUES 
(2, 'Pendiente', 'En progreso', NOW(6), 'Soporte TI - Andrés', 'Solicitud aprobada por jefe directo, en proceso de compra.'),
(3, 'Pendiente', 'En progreso', NOW(6), 'Soporte TI - Andrés', 'Diagnóstico iniciado inmediatamente por prioridad crítica.'),
(3, 'En progreso', 'Resuelta', NOW(6), 'Soporte TI - Andrés', 'Se reinició el servicio mysqld y se ajustó el timeout de conexiones en my.cnf. Monitoreo OK.'),
(5, 'Pendiente', 'Cancelada', NOW(6), 'Juan Pérez', 'Cancelada a solicitud directa del usuario.');
