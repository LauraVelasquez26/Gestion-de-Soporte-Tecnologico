-- ============================================================
-- SCRIPT DE BASE DE DATOS PARA MYSQL WORKBENCH
-- Aplicación: Gestión de Solicitudes de Soporte Tecnológico
-- ============================================================

CREATE DATABASE IF NOT EXISTS `soporte_tecnico_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `soporte_tecnico_db`;

-- Tabla Principal: Solicitudes de Soporte
CREATE TABLE IF NOT EXISTS `tickets_solicitud` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `titulo` VARCHAR(200) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `usuario_solicitante` VARCHAR(100) NOT NULL,
    `categoria` ENUM('Hardware', 'Software', 'Red', 'Accesos', 'Otros') NOT NULL,
    `prioridad` ENUM('Baja', 'Media', 'Alta', 'Crítica') NOT NULL,
    `estado` ENUM('Pendiente', 'En progreso', 'Resuelta', 'Cancelada') NOT NULL DEFAULT 'Pendiente',
    `fecha_creacion` DATETIME(6) NOT NULL,
    `fecha_actualizacion` DATETIME(6) NOT NULL,
    INDEX `idx_estado` (`estado`),
    INDEX `idx_prioridad` (`prioridad`),
    INDEX `idx_categoria` (`categoria`),
    INDEX `idx_fecha_creacion` (`fecha_creacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Auditoría: Historial de Cambios de Estado
CREATE TABLE IF NOT EXISTS `tickets_historialsolicitud` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `solicitud_id` INT NOT NULL,
    `estado_anterior` VARCHAR(50) NOT NULL,
    `estado_nuevo` VARCHAR(50) NOT NULL,
    `fecha_cambio` DATETIME(6) NOT NULL,
    `usuario_responsable` VARCHAR(100) NOT NULL,
    `observacion` TEXT NULL,
    CONSTRAINT `fk_historial_solicitud` 
        FOREIGN KEY (`solicitud_id`) 
        REFERENCES `tickets_solicitud` (`id`) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
