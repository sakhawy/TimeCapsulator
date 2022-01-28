from django.conf import settings

from celery.decorators import task
from celery.utils.log import get_task_logger

from .models import Capsule, User
from .emails import send_capsule_unlocked_email

logger = get_task_logger(__name__)

@task(name="send_capsule_unlocked_email_task")
def unlock_capsule_task(user_id, capsule_id, capsule_url):
    "This task is dedicated to unlocking the capsule and notifying the user about it."
    
    capsule = Capsule.objects.get(id=capsule_id)
    user = User.objects.get(id=user_id)

    # Unlock the capsule
    capsule.state = Capsule.UNLOCKED
    capsule.save()
    logger.info(f"Capsule '{capsule.name}#{capsule.key}' was unlocked.")

    # Send the email
    first_name = user.first_name
    email = user.email
    capsule_name = capsule.name
    capsule_creation_date = capsule.creation_date
    send_capsule_unlocked_email(first_name, email, capsule_name, capsule_creation_date, capsule_url)
    logger.info(f"An Email to user '{email}' was sent.")
    
    return True