from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from django.core.exceptions import ValidationError as DjangoValidationError

from .models import Solicitud, HistorialSolicitud
from .serializers import (
    SolicitudSerializer,
    HistorialSolicitudSerializer,
    CambioEstadoSerializer
)


class SolicitudViewSet(viewsets.ModelViewSet):
    """
    ViewSet para la gestión integral de Solicitudes de Soporte Tecnológico.
    Proporciona CRUD, búsqueda, filtros, ordenamiento, paginación, cambio de estado e historial.
    """
    queryset = Solicitud.objects.all()
    serializer_class = SolicitudSerializer

    def get_queryset(self):
        queryset = Solicitud.objects.all()

        # 1. Búsqueda por texto (Título, Descripción, Usuario)
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(titulo__icontains=search) |
                Q(descripcion__icontains=search) |
                Q(usuario_solicitante__icontains=search)
            )

        # 2. Filtrado por Categoría, Prioridad y Estado
        categoria = self.request.query_params.get('categoria', None)
        if categoria:
            queryset = queryset.filter(categoria__iexact=categoria)

        prioridad = self.request.query_params.get('prioridad', None)
        if prioridad:
            queryset = queryset.filter(prioridad__iexact=prioridad)

        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado__iexact=estado)

        # 3. Ordenamiento
        ordering = self.request.query_params.get('ordering', '-fecha_creacion')
        allowed_ordering = [
            'fecha_creacion', '-fecha_creacion',
            'fecha_actualizacion', '-fecha_actualizacion',
            'prioridad', '-prioridad',
            'estado', '-estado',
            'titulo', '-titulo'
        ]
        if ordering in allowed_ordering:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('-fecha_creacion')

        return queryset

    @action(detail=True, methods=['post'], url_path='cambiar-estado')
    def cambiar_estado(self, request, pk=None):
        """
        Endpoint personalizado para cambiar de estado una solicitud.
        Ejecuta las validaciones de negocio del método de dominio `cambiar_estado`.
        """
        solicitud = self.get_object()
        serializer = CambioEstadoSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        nuevo_estado = serializer.validated_data['nuevo_estado']
        usuario_responsable = serializer.validated_data['usuario_responsable']
        observacion = serializer.validated_data.get('observacion', '')

        try:
            historial_entry = solicitud.cambiar_estado(
                nuevo_estado=nuevo_estado,
                usuario_responsable=usuario_responsable,
                observacion=observacion
            )
            return Response({
                "mensaje": f"Solicitud #{solicitud.id} cambió exitosamente a '{nuevo_estado}'.",
                "solicitud": SolicitudSerializer(solicitud).data,
                "historial_creado": HistorialSolicitudSerializer(historial_entry).data
            }, status=status.HTTP_200_OK)

        except DjangoValidationError as err:
            return Response({"error": err.message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'], url_path='historial')
    def consultar_historial(self, request, pk=None):
        """
        Endpoint para consultar el historial de cambios de una solicitud específica.
        """
        solicitud = self.get_object()
        historial = solicitud.historial.all()
        serializer = HistorialSolicitudSerializer(historial, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='stats')
    def obtener_estadisticas(self, request):
        """
        Endpoint para obtener los contadores agregados por estado (KPIs del Dashboard).
        """
        total = Solicitud.objects.count()
        por_estado = dict(
            Solicitud.objects.values('estado')
            .annotate(total=Count('id'))
            .values_list('estado', 'total')
        )
        return Response({
            "total": total,
            "pendiente": por_estado.get('Pendiente', 0),
            "en_progreso": por_estado.get('En progreso', 0),
            "resuelta": por_estado.get('Resuelta', 0),
            "cancelada": por_estado.get('Cancelada', 0)
        })
