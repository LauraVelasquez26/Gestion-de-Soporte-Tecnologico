from rest_framework import serializers
from .models import Solicitud, HistorialSolicitud, CATEGORIA_CHOICES, PRIORIDAD_CHOICES, ESTADO_CHOICES


class HistorialSolicitudSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialSolicitud
        fields = [
            'id',
            'solicitud',
            'estado_anterior',
            'estado_nuevo',
            'fecha_cambio',
            'usuario_responsable',
            'observacion'
        ]
        read_only_fields = ['id', 'fecha_cambio']


class SolicitudSerializer(serializers.ModelSerializer):
    historial = HistorialSolicitudSerializer(many=True, read_only=True)

    class Meta:
        model = Solicitud
        fields = [
            'id',
            'titulo',
            'descripcion',
            'usuario_solicitante',
            'categoria',
            'prioridad',
            'estado',
            'fecha_creacion',
            'fecha_actualizacion',
            'historial'
        ]
        read_only_fields = ['id', 'estado', 'fecha_creacion', 'fecha_actualizacion', 'historial']

    def validate_titulo(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("El título no puede estar vacío.")
        if len(value) < 5:
            raise serializers.ValidationError("El título debe tener al menos 5 caracteres.")
        return value.strip()

    def validate_descripcion(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("La descripción no puede estar vacía.")
        return value.strip()

    def validate_usuario_solicitante(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("El usuario solicitante es obligatorio.")
        return value.strip()

    def update(self, instance, validated_data):
        if instance.estado in ['Resuelta', 'Cancelada']:
            raise serializers.ValidationError(
                f"Regla de Negocio: No es posible editar la información de una solicitud en estado '{instance.estado}' porque es un estado final."
            )
        return super().update(instance, validated_data)


class CambioEstadoSerializer(serializers.Serializer):
    nuevo_estado = serializers.ChoiceField(choices=ESTADO_CHOICES)
    usuario_responsable = serializers.CharField(max_length=100)
    observacion = serializers.CharField(required=False, allow_blank=True, default="")

    def validate_usuario_responsable(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("El usuario responsable es obligatorio.")
        return value.strip()
