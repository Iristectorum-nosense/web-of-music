# Generated by Django 4.1.7 on 2023-05-03 09:39

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("myMusic", "0008_rename_mv_id_song_mv"),
    ]

    operations = [
        migrations.AddField(
            model_name="song",
            name="time",
            field=models.DurationField(default=datetime.timedelta(0)),
        ),
    ]