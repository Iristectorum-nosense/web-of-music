# Generated by Django 4.1.7 on 2023-05-04 07:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("myMusic", "0009_song_time"),
    ]

    operations = [
        migrations.CreateModel(
            name="Album",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("url", models.CharField(default="", max_length=64)),
                ("name", models.CharField(default="", max_length=64)),
                ("publish", models.DateTimeField()),
                ("songs", models.ManyToManyField(to="myMusic.song")),
            ],
            options={"db_table": "album",},
        ),
        migrations.AddField(
            model_name="singer",
            name="albums",
            field=models.ManyToManyField(to="myMusic.album"),
        ),
    ]
