# Generated by Django 3.1.7 on 2021-05-30 15:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('capsulator', '0006_auto_20210529_0804'),
    ]

    operations = [
        migrations.AddField(
            model_name='resource',
            name='message',
            field=models.CharField(default='Gay', max_length=10000),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='capsule',
            name='key',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]
