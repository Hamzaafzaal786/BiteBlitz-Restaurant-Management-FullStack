from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    CategoryViewSet, MenuItemViewSet, StaffViewSet, 
    TableViewSet, ReservationViewSet, OrderViewSet, 
    OrderItemViewSet, PaymentViewSet, dashboard_summary
)

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'menu-items', MenuItemViewSet, basename='menuitem')
router.register(r'staff', StaffViewSet, basename='staff')
router.register(r'tables', TableViewSet, basename='table')
router.register(r'reservations', ReservationViewSet, basename='reservation')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'order-items', OrderItemViewSet, basename='orderitem')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    # Authentication URLs
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Dashboard URL
    path('dashboard/summary/', dashboard_summary, name='dashboard_summary'),
    
    # Include all router URLs
    path('', include(router.urls)),
]