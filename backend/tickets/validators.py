from django.core.exceptions import ValidationError

# Definición de Estados y Prioridades
ESTADO_PENDIENTE = 'Pendiente'
ESTADO_EN_PROGRESO = 'En progreso'
ESTADO_RESUELTA = 'Resuelta'
ESTADO_CANCELADA = 'Cancelada'

PRIORIDAD_CRITICA = 'Crítica'

TRANSICIONES_PERMITIDAS = {
    ESTADO_PENDIENTE: [ESTADO_EN_PROGRESO, ESTADO_CANCELADA],
    ESTADO_EN_PROGRESO: [ESTADO_RESUELTA, ESTADO_CANCELADA],
    ESTADO_RESUELTA: [],  # Terminal
    ESTADO_CANCELADA: [],  # Terminal
}


def validar_transicion_estado(estado_actual, estado_nuevo):
    """
    Valida si el cambio de estado de una solicitud es permitido según las reglas de negocio.
    """
    if estado_actual == estado_nuevo:
        return  # Sin cambio de estado

    permitidos = TRANSICIONES_PERMITIDAS.get(estado_actual, [])

    if estado_nuevo not in permitidos:
        raise ValidationError(
            f"Transición no permitida: No se puede pasar de '{estado_actual}' a '{estado_nuevo}'. "
            f"Transiciones válidas desde '{estado_actual}': {permitidos if permitidos else 'Ninguna (Estado final)'}."
        )


def validar_observacion_resolucion_critica(prioridad, estado_nuevo, observacion):
    """
    Regla de Negocio: Una solicitud con prioridad Crítica debe registrar una observación al ser resuelta.
    """
    if prioridad == PRIORIDAD_CRITICA and estado_nuevo == ESTADO_RESUELTA:
        if not observacion or not observacion.strip():
            raise ValidationError(
                "Es obligatorio registrar una observación al marcar como Resuelta una solicitud con prioridad Crítica."
            )
