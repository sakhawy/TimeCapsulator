# Generated by Django 3.1.7 on 2021-05-31 12:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('capsulator', '0007_auto_20210530_1537'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resource',
            name='member',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='resources', to='capsulator.member'),
        ),
    ]