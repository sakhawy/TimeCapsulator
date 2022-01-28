from django.core.mail import EmailMessage
from django.template import Context
from django.template.loader import render_to_string
from django.conf import settings 

def send_capsule_unlocked_email(first_name, email, capsule_name, capsule_creation_date, capsule_url):
    
    context = {
        'first_name': first_name,
        'email': email,
        'capsule_name': capsule_name,
        'capsule_creation_date': capsule_creation_date,
        'capsule_url': capsule_url
    }

    email_subject = 'Your Time Capsule has been unlocked!'
    email_body = render_to_string('capsule_unlocked_email_template.txt', context)

    email = EmailMessage(
        email_subject,
        email_body,
        settings.EMAIL_HOST_USER,
        [email, ]
    )

    return email.send(fail_silently=False)