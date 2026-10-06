from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SolicitudViewSet

router = DefaultRouter()
router.register(r'tickets', SolicitudViewSet, basename='ticket')

urlpatterns = [
    path('', include(router.urls)),
]
