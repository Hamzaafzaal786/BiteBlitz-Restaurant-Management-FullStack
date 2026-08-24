from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta

from .models import (
    Category, MenuItem, Staff, Table, 
    Reservation, Order, OrderItem, Payment
)
from .serializers import (
    CategorySerializer, MenuItemSerializer, StaffSerializer, 
    TableSerializer, ReservationSerializer, OrderSerializer, 
    OrderItemSerializer, PaymentSerializer, DashboardSummarySerializer
)

# Category ViewSet
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Category.objects.all()
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        return queryset


# MenuItem ViewSet
class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = MenuItem.objects.all()
        
        # Filter by category
        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Filter by availability
        is_available = self.request.query_params.get('is_available', None)
        if is_available is not None:
            queryset = queryset.filter(is_available=is_available.lower() == 'true')
        
        # Search by name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get all available menu items"""
        items = MenuItem.objects.filter(is_available=True)
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)


# Staff ViewSet
class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Staff.objects.all()
        role = self.request.query_params.get('role', None)
        if role:
            queryset = queryset.filter(role=role)
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        return queryset


# Table ViewSet
class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Table.objects.all()
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get all available tables"""
        tables = Table.objects.filter(status='available')
        serializer = self.get_serializer(tables, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update table status"""
        table = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(Table.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        table.status = new_status
        table.save()
        serializer = self.get_serializer(table)
        return Response(serializer.data)


# Reservation ViewSet
class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Reservation.objects.all()
        
        # Filter by date
        date_param = self.request.query_params.get('date', None)
        if date_param:
            queryset = queryset.filter(date=date_param)
        
        # Filter by confirmation status
        is_confirmed = self.request.query_params.get('is_confirmed', None)
        if is_confirmed is not None:
            queryset = queryset.filter(is_confirmed=is_confirmed.lower() == 'true')
        
        return queryset

    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's reservations"""
        today = timezone.now().date()
        reservations = Reservation.objects.filter(date=today)
        serializer = self.get_serializer(reservations, many=True)
        return Response(serializer.data)


# 6. Order ViewSet
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Order.objects.all()
        
        # Filter by status
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by date
        date_param = self.request.query_params.get('date', None)
        if date_param:
            queryset = queryset.filter(order_date__date=date_param)
        
        # Filter by table
        table_id = self.request.query_params.get('table', None)
        if table_id:
            queryset = queryset.filter(table_id=table_id)
        
        return queryset

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active orders (pending, preparing, ready)"""
        active_orders = Order.objects.exclude(
            status__in=['completed', 'cancelled']
        )
        serializer = self.get_serializer(active_orders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's orders"""
        today = timezone.now().date()
        orders = Order.objects.filter(order_date__date=today)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update order status"""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save()
        
        # If order is completed, update table status
        if new_status == 'completed':
            table = order.table
            table.status = 'available'
            table.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)


# OrderItem ViewSet
class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = OrderItem.objects.all()
        order_id = self.request.query_params.get('order', None)
        if order_id:
            queryset = queryset.filter(order_id=order_id)
        return queryset


# Payment ViewSet
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Payment.objects.all()
        order_id = self.request.query_params.get('order', None)
        if order_id:
            queryset = queryset.filter(order_id=order_id)
        return queryset

    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's payments"""
        today = timezone.now().date()
        payments = Payment.objects.filter(payment_date__date=today)
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data)


# Dashboard View
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    """Get dashboard summary statistics"""
    today = timezone.now().date()
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())
    
    # Total orders today
    total_orders = Order.objects.filter(order_date__date=today).count()
    
    # Active orders (not completed or cancelled)
    active_orders = Order.objects.exclude(
        status__in=['completed', 'cancelled']
    ).count()
    
    # Total revenue today
    total_revenue = Payment.objects.filter(
        payment_date__date=today,
        is_successful=True
    ).aggregate(Sum('amount'))['amount__sum'] or 0
    
    # Available tables
    available_tables = Table.objects.filter(status='available').count()
    
    # Today's reservations
    today_reservations = Reservation.objects.filter(date=today).count()
    
    # Popular items (top 5)
    popular_items = OrderItem.objects.values(
        'menu_item__name'
    ).annotate(
        total_quantity=Sum('quantity')
    ).order_by('-total_quantity')[:5]
    
    data = {
        'total_orders': total_orders,
        'active_orders': active_orders,
        'total_revenue': total_revenue,
        'available_tables': available_tables,
        'today_reservations': today_reservations,
        'popular_items': list(popular_items)
    }
    
    serializer = DashboardSummarySerializer(data)
    return Response(serializer.data)