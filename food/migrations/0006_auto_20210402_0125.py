# Generated by Django 3.1.7 on 2021-04-01 19:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('food', '0005_auto_20210331_0224'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fooditem',
            name='description',
            field=models.CharField(max_length=15, null=True),
        ),
    ]
