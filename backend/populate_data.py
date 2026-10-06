import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soporte_project.settings')
django.setup()

from tickets.models import Solicitud, HistorialSolicitud

def seed_database():
    print("Iniciando poblamiento de base de datos...")
    
    # Limpieza
    HistorialSolicitud.objects.all().delete()
    Solicitud.objects.all().delete()

    t1 = Solicitud.objects.create(
        titulo='Fallo en Impresora Principal del Piso 3',
        descripcion='La impresora no responde y muestra error de atasco de papel recurrente.',
        usuario_solicitante='Carlos Mendoza',
        categoria='Hardware',
        prioridad='Media',
        estado='Pendiente'
    )

    t2 = Solicitud.objects.create(
        titulo='Solicitud de Licencia Visual Studio Code Pro',
        descripcion='Se requiere licencia para el nuevo desarrollador frontend del equipo.',
        usuario_solicitante='Ana María Gómez',
        categoria='Software',
        prioridad='Baja',
        estado='Pendiente'
    )
    t2.cambiar_estado(
        nuevo_estado='En progreso',
        usuario_responsable='Soporte TI - Andrés',
        observacion='Solicitud aprobada por jefe directo, en proceso de compra.'
    )

    t3 = Solicitud.objects.create(
        titulo='Caída de conexión en Servidor DB Principal',
        descripcion='Interrupción imprevista de conexión MySQL en producción durante 5 minutos.',
        usuario_solicitante='Roberto Silva',
        categoria='Red',
        prioridad='Crítica',
        estado='Pendiente'
    )
    t3.cambiar_estado(
        nuevo_estado='En progreso',
        usuario_responsable='Soporte TI - Andrés',
        observacion='Diagnóstico iniciado inmediatamente por prioridad crítica.'
    )
    t3.cambiar_estado(
        nuevo_estado='Resuelta',
        usuario_responsable='Soporte TI - Andrés',
        observacion='Se reinició el servicio mysqld y se ajustó el timeout de conexiones en my.cnf. Monitoreo OK.'
    )

    t4 = Solicitud.objects.create(
        titulo='Creación de usuario y correo para practicante',
        descripcion='Crear correo corporativo y acceso a VPN para nuevo practicante de QA.',
        usuario_solicitante='Laura Restrepo',
        categoria='Accesos',
        prioridad='Alta',
        estado='Pendiente'
    )

    t5 = Solicitud.objects.create(
        titulo='Solicitud de monitor secundario cancelada',
        descripcion='El colaborador informa que utilizará su pantalla laptop personal.',
        usuario_solicitante='Juan Pérez',
        categoria='Hardware',
        prioridad='Baja',
        estado='Pendiente'
    )
    t5.cambiar_estado(
        nuevo_estado='Cancelada',
        usuario_responsable='Juan Pérez',
        observacion='Cancelada a solicitud directa del usuario.'
    )

    print(f"Base de datos poblada exitosamente con {Solicitud.objects.count()} solicitudes y {HistorialSolicitud.objects.count()} registros de historial.")

if __name__ == '__main__':
    seed_database()
