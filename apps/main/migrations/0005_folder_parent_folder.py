# Generated by Django 3.2.6 on 2022-06-13 07:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_auto_20220606_2152'),
    ]

    operations = [
        migrations.AddField(
            model_name='folder',
            name='parent_folder',
            field=models.IntegerField(blank=True, default=0, null=True, verbose_name='Parent Folder'),
        ),
    ]
