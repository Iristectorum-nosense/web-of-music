# Generated by Django 4.1.7 on 2023-04-25 17:50

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("myMusic", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(model_name="mv", name="singer",),
        migrations.AddField(
            model_name="mv",
            name="desc",
            field=models.CharField(default=django.utils.timezone.now, max_length=512),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="mv",
            name="publish",
            field=models.DateTimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="singer",
            name="mvs",
            field=models.ManyToManyField(to="myMusic.mv"),
        ),
    ]