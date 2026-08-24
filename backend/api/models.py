from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

# ============================================
# 1. Category Model
# ============================================
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']


# ============================================
# 2. MenuItem Model
# ============================================
class MenuItem(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='menu_items')
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    is_available = models.BooleanField(default=True)
    preparation_time = models.IntegerField(help_text="Preparation time in minutes", default=10)
    image = models.ImageField(upload_to='menu/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} (${self.price})"

    class Meta:
        ordering = ['category', 'name']


# ============================================
# 3. Staff Model
# ============================================
class Staff(models.Model):
    ROLE_CHOICES = (
        ('waiter', 'Waiter'),
        ('chef', 'Chef'),
        ('manager', 'Manager'),
        ('admin', 'Admin'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile', null=True, blank=True)
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='waiter')
    phone = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    hire_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.get_role_display()})"

    class Meta:
        ordering = ['name']


# ============================================
# 4. Table Model (Dining Tables)
# ============================================
class Table(models.Model):
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('occupied', 'Occupied'),
        ('reserved', 'Reserved'),
        ('cleaning', 'Under Cleaning'),
    )
    
    table_number = models.IntegerField(unique=True)
    capacity = models.IntegerField(validators=[MinValueValidator(1)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Table {self.table_number} ({self.capacity} seats) - {self.get_status_display()}"

    class Meta:
        ordering = ['table_number']


# ============================================
# 5. Reservation Model
# ============================================
class Reservation(models.Model):
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='reservations')
    customer_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    date = models.DateField()
    time = models.TimeField()
    guests = models.IntegerField(validators=[MinValueValidator(1)])
    special_requests = models.TextField(blank=True)
    is_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.customer_name} - Table {self.table.table_number} - {self.date} at {self.time}"

    class Meta:
        ordering = ['-date', '-time']


# ============================================
# 6. Order Model
# ============================================
class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('served', 'Served'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='orders')
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    customer_name = models.CharField(max_length=100, blank=True, null=True)
    customer_phone = models.CharField(max_length=15, blank=True, null=True)
    is_takeaway = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - Table {self.table.table_number} - {self.get_status_display()}"

    class Meta:
        ordering = ['-order_date']


# ============================================
# 7. OrderItem Model (Junction Table)
# ============================================
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    item_price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at time of order
    special_instructions = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name} (Order #{self.order.id})"

    class Meta:
        ordering = ['order', 'id']


# ============================================
# 8. Payment Model
# ============================================
class Payment(models.Model):
    METHOD_CHOICES = (
        ('cash', 'Cash'),
        ('card', 'Credit/Debit Card'),
        ('upi', 'UPI'),
        ('digital_wallet', 'Digital Wallet'),
    )
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    method = models.CharField(max_length=20, choices=METHOD_CHOICES, default='cash')
    payment_date = models.DateTimeField(auto_now_add=True)
    is_successful = models.BooleanField(default=True)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment for Order #{self.order.id} - {self.method} - ${self.amount}"

    class Meta:
        ordering = ['-payment_date']