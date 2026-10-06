import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soporte_project.settings')
django.setup()

from django.core.exceptions import ValidationError
from tickets.models import Solicitud, HistorialSolicitud
from tickets.validators import validar_transicion_estado, validar_observacion_resolucion_critica

def run_tests():
    print("--- INICIANDO VERIFICACION AUTOMATIZADA DE REGLAS DE NEGOCIO ---")

    # Prueba 1: Transición Permitida (Pendiente -> En progreso)
    print("Prueba 1: Pendiente -> En progreso...")
    try:
        validar_transicion_estado('Pendiente', 'En progreso')
        print("  [OK] Exitoso: Transicion permitida.")
    except ValidationError as e:
        print(f"  [ERROR] Fallo: {e}")

    # Prueba 2: Transición Prohibida (Cancelada -> En progreso)
    print("Prueba 2: Cancelada -> En progreso (Debe Fallar)...")
    try:
        validar_transicion_estado('Cancelada', 'En progreso')
        print("  [ERROR]: La transicion prohibida no lanzo ValidationError.")
    except ValidationError as e:
        print(f"  [OK] Exitoso: Se previno la transicion prohibida correctamente ({e.message}).")

    # Prueba 3: Prioridad Crítica a Resuelta sin observación (Debe Fallar)
    print("Prueba 3: Prioridad Critica a Resuelta sin observacion (Debe Fallar)...")
    try:
        validar_observacion_resolucion_critica('Crítica', 'Resuelta', '')
        print("  [ERROR]: Permitio resolver ticket Critico sin observacion.")
    except ValidationError as e:
        print(f"  [OK] Exitoso: Exige observacion en prioridad Critica ({e.message}).")

    # Prueba 4: Prioridad Crítica a Resuelta CON observación (Debe Pasar)
    print("Prueba 4: Prioridad Critica a Resuelta CON observacion...")
    try:
        validar_observacion_resolucion_critica('Crítica', 'Resuelta', 'Se me ajusto la configuracion DB.')
        print("  [OK] Exitoso: Permite resolucion con observacion.")
    except ValidationError as e:
        print(f"  [ERROR] Fallo: {e}")

    print("--- TODAS LAS PRUEBAS AUTOMATIZADAS DE DOMINIO PASARON CON EXITO ---")

if __name__ == '__main__':
    run_tests()
