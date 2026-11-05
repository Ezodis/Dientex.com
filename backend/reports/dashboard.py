from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum, Count
from patients.models import Patient
from appointments.models import Appointment
from treatments.models import Treatment
from finances.models import Payment, Expense


@api_view(['GET'])
def dashboard_summary(request):
    """
    Get dashboard summary for today
    """
    today = timezone.now().date()
    
    # Today's appointments
    today_appointments = Appointment.objects.filter(date=today)
    appointments_count = today_appointments.count()
    
    # Patients attended today (completed appointments)
    patients_attended = today_appointments.filter(status='completed').count()
    
    # Income today
    daily_income = Payment.objects.filter(payment_date=today).aggregate(
        total=Sum('amount')
    )['total'] or 0
    
    # Pending debts
    pending_debts = Treatment.objects.filter(
        status__in=['in_progress', 'with_debt']
    ).aggregate(
        total=Sum('total_price') - Sum('amount_paid')
    )
    pending_debts_amount = pending_debts.get('total', 0) or 0
    
    # Active treatments count
    active_treatments = Treatment.objects.filter(status='in_progress').count()
    
    # Total patients
    total_patients = Patient.objects.filter(is_active=True).count()
    
    # Upcoming appointments
    upcoming_appointments = Appointment.objects.filter(
        date__gte=today,
        status__in=['pending', 'confirmed']
    ).count()
    
    # Monthly stats
    monthly_income = Payment.objects.filter(
        payment_date__year=today.year,
        payment_date__month=today.month
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    monthly_expenses = Expense.objects.filter(
        expense_date__year=today.year,
        expense_date__month=today.month
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    return Response({
        'today': {
            'appointments': appointments_count,
            'patients_attended': patients_attended,
            'income': float(daily_income),
        },
        'pending_debts': float(pending_debts_amount),
        'active_treatments': active_treatments,
        'total_patients': total_patients,
        'upcoming_appointments': upcoming_appointments,
        'monthly': {
            'income': float(monthly_income),
            'expenses': float(monthly_expenses),
            'net': float(monthly_income - monthly_expenses),
        }
    })
