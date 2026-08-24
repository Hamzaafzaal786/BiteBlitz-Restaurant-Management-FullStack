from rest_framework import serializers
from .models import (
    Category, MenuItem, Staff, Table, 
    Reservation, Order, OrderItem, Payment
)

# ============================================
# 1. Category Serializer
# ============================================
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at']


# ============================================
# 2. MenuItem Serializer
# ============================================
class MenuItemSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    
    class Meta:
        model = MenuItem
        fields = [
            'id', 'category', 'category_name', 'name', 'description', 
            'price', 'is_available', 'preparation_time', 'image', 
            'created_at', 'updated_at'
        ]


# ============================================
# 3. Staff Serializer
# ============================================
class StaffSerializer(serializers.ModelSerializer):
    role_display = serializers.ReadOnlyField(source='get_role_display')
    
    class Meta:
        model = Staff
        fields = [
            'id', 'user', 'name', 'role', 'role_display', 
            'phone', 'email', 'hire_date', 'is_active', 
            'created_at', 'updated_at'
        ]


# ============================================
# 4. Table Serializer
# ============================================
class TableSerializer(serializers.ModelSerializer):
    status_display = serializers.ReadOnlyField(source='get_status_display')
    
    class Meta:
        model = Table
        fields = [
            'id', 'table_number', 'capacity', 'status', 
            'status_display', 'is_active', 'created_at', 'updated_at'
        ]


# ============================================
# 5. Reservation Serializer
# ============================================
class ReservationSerializer(serializers.ModelSerializer):
    table_number = serializers.ReadOnlyField(source='table.table_number')
    
    class Meta:
        model = Reservation
        fields = [
            'id', 'table', 'table_number', 'customer_name', 'phone', 
            'email', 'date', 'time', 'guests', 'special_requests', 
            'is_confirmed', 'created_at', 'updated_at'
        ]


# ============================================
# 6. OrderItem Serializer
# ============================================
class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.ReadOnlyField(source='menu_item.name')
    menu_item_price = serializers.ReadOnlyField(source='menu_item.price')
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'order', 'menu_item', 'menu_item_name', 
            'menu_item_price', 'quantity', 'item_price', 
            'special_instructions', 'created_at', 'updated_at'
        ]


# ============================================
# 7. Order Serializer
# ============================================
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    staff_name = serializers.ReadOnlyField(source='staff.name')
    table_number = serializers.ReadOnlyField(source='table.table_number')
    status_display = serializers.ReadOnlyField(source='get_status_display')
    
    class Meta:
        model = Order
        fields = [
            'id', 'table', 'table_number', 'staff', 'staff_name',
            'order_date', 'status', 'status_display', 'total_amount',
            'customer_name', 'customer_phone', 'is_takeaway',
            'items', 'created_at', 'updated_at'
        ]


# ============================================
# 8. Payment Serializer
# ============================================
class PaymentSerializer(serializers.ModelSerializer):
    order_id_display = serializers.ReadOnlyField(source='order.id')
    method_display = serializers.ReadOnlyField(source='get_method_display')
    
    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'order_id_display', 'amount', 
            'method', 'method_display', 'payment_date', 
            'is_successful', 'transaction_id', 'created_at', 'updated_at'
        ]


# ============================================
# 9. Dashboard Summary Serializer
# ============================================
class DashboardSummarySerializer(serializers.Serializer):
    total_orders = serializers.IntegerField()
    active_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    available_tables = serializers.IntegerField()
    today_reservations = serializers.IntegerField()
    popular_items = serializers.ListField()