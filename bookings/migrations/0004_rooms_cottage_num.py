# Generated by Django 3.1 on 2021-04-10 22:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0003_auto_20210402_0505'),
    ]

    operations = [
        migrations.AddField(
            model_name='rooms',
            name='cottage_num',
            field=models.IntegerField(default=1),
        ),
    ]