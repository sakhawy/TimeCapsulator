# Generated by Django 3.2.4 on 2022-01-28 13:09

from django.db import migrations, models
import gdstorage.storage


class Migration(migrations.Migration):

    dependencies = [
        ('capsulator', '0013_auto_20210602_1442'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='content',
            field=models.FileField(storage=gdstorage.storage.GoogleDriveStorage(), upload_to=''),
        ),
    ]
