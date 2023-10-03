#!/bin/bash

#echo "Flush the manage.py command it any"
#
#while ! python manage.py flush --no-input 2>&1; do
#  echo "Flushing django manage command"
#  sleep 3
#done

echo "Migrate django database"

while ! python manage.py migrate 2>&1; do
  echo "migration in progress"
  sleep 3
done

echo "Django is configured!"

COMMAND="$@"

mqttasgi -H mqtt -p 1883 weather_station.asgi:application &

echo "$COMMAND"

eval "$COMMAND"

