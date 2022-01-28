# Generated by Django 3.1.7 on 2021-05-28 15:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('capsulator', '0002_member_public'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='member',
            name='public',
        ),
        migrations.AddField(
            model_name='capsule',
            name='public',
            field=models.BooleanField(default=False, verbose_name=False),
            preserve_default=False,
        ),
    ]