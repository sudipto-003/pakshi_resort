# Generated by Django 3.1 on 2021-04-21 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tickets',
            name='issued_on',
        ),
        migrations.AlterField(
            model_name='tickets',
            name='issued_date',
            field=models.DateField(auto_now_add=True),
        ),
    ]
