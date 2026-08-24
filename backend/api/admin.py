from django.contrib import admin
from .models import (
    Category, MenuItem, Staff, Table, 
    Reservation, Order, OrderItem, Payment
)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    search_fields = ['name']
    list_filter = ['is_active']

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'is_available', 'preparation_time']
    search_fields = ['name', 'description']
    list_filter = ['category', 'is_available']
    list_editable = ['price', 'is_available']

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'phone', 'email', 'is_active']
    search_fields = ['name', 'email', 'phone']
    list_filter = ['role', 'is_active']

@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ['table_number', 'capacity', 'status']
    list_filter = ['status']
    list_editable = ['status']

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'table', 'date', 'time', 'guests', 'is_confirmed']
    search_fields = ['customer_name', 'phone']
    list_filter = ['is_confirmed', 'date']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'table', 'staff', 'status', 'total_amount', 'order_date']
    list_filter = ['status', 'is_takeaway']
    search_fields = ['customer_name', 'customer_phone']
    list_editable = ['status']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'menu_item', 'quantity', 'item_price']
    search_fields = ['menu_item__name']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['order', 'amount', 'method', 'is_successful', 'payment_date']
    list_filter = ['method', 'is_successful']