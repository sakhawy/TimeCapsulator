# Generated by Django 3.1.7 on 2021-05-29 08:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('capsulator', '0004_auto_20210528_1610'),
    ]

    operations = [
        migrations.RenameField(
            model_name='capsule',
            old_name='public',
            new_name='isPublic',
        ),
    ]
