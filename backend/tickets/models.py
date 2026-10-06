from django.db import models
from .validators import (
    validar_transicion_estado,
    validar_observacion_resolucion_critica
)

CATEGORIA_CHOICES = [
    ('Hardware', 'Hardware'),
    ('Software', 'Software'),
    ('Red', 'Red'),
    ('Accesos', 'Accesos'),
    ('Otros', 'Otros'),
]

PRIORIDAD_CHOICES = [
    ('Baja', 'Baja'),
    ('Media', 'Media'),
    ('Alta', 'Alta'),
    ('Crítica', 'Crítica'),
]

ESTADO_CHOICES = [
    ('Pendiente', 'Pendiente'),
    ('En progreso', 'En progreso'),
    ('Resuelta', 'Resuelta'),
    ('Cancelada', 'Cancelada'),
]


class Solicitud(models.Model):
    titulo = models.CharField(max_length=200, help_text="Título breve de la solicitud")
    descripcion = models.TextField(help_text="Detalle completo de la solicitud")
    usuario_solicitante = models.CharField(max_length=100, help_text="Nombre o usuario del solicitante")
    categoria = models.CharField(max_length=50, choices=CATEGORIA_CHOICES, help_text="Categoría del problema")
    prioridad = models.CharField(max_length=50, choices=PRIORIDAD_CHOICES, help_text="Prioridad de atención")
    estado = models.CharField(max_length=50, choices=ESTADO_CHOICES, default='Pendiente', help_text="Estado actual")
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Solicitud de Soporte"
        verbose_name_plural = "Solicitudes de Soporte"
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"#{self.id} - {self.titulo} ({self.estado})"

    def cambiar_estado(self, nuevo_estado, usuario_responsable, observacion=None):
        """
        Método de dominio para cambiar de estado aplicando validadores y registrando en el historial.
        """
        estado_anterior = self.estado

        # 1. Validar transición de estado
        validar_transicion_estado(estado_anterior, nuevo_estado)

        # 2. Validar regla de observación obligatoria en prioridad Crítica
        validar_observacion_resolucion_critica(self.prioridad, nuevo_estado, observacion)

        # 3. Actualizar estado de la solicitud
        self.estado = nuevo_estado
        self.save()

        # 4. Registrar evento en el historial de auditoría
        historial_entry = HistorialSolicitud.objects.create(
            solicitud=self,
            estado_anterior=estado_anterior,
            estado_nuevo=nuevo_estado,
            usuario_responsable=usuario_responsable,
            observacion=observacion or ""
        )
        return historial_entry


class HistorialSolicitud(models.Model):
    solicitud = models.ForeignKey(
        Solicitud,
        on_delete=models.CASCADE,
        related_name='historial',
        help_text="Solicitud asociada"
    )
    estado_anterior = models.CharField(max_length=50)
    estado_nuevo = models.CharField(max_length=50)
    fecha_cambio = models.DateTimeField(auto_now_add=True)
    usuario_responsable = models.CharField(max_length=100, help_text="Usuario que efectuó el cambio")
    observacion = models.TextField(blank=True, null=True, help_text="Observación opcional u obligatoria")

    class Meta:
        verbose_name = "Historial de Solicitud"
        verbose_name_plural = "Historiales de Solicitudes"
        ordering = ['-fecha_cambio']

    def __str__(self):
        return f"Solicitud #{self.solicitud_id}: {self.estado_anterior} -> {self.estado_nuevo} ({self.fecha_cambio.strftime('%Y-%m-%d %H:%M')})"
