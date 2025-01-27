#!/bin/bash

# Variables
DB_USER=root
DB_PASSWORD=root
DB_NAME=trello_db
DB_HOST=mysql
BACKUP_DIR=backups_db
DATE=$(date +"%Y-%m-%d_%H-%M-%S")

mkdir -p "$BACKUP_DIR"

mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_DIR/${DB_NAME}_backup_$DATE.sql"

if [ $? -eq 0 ]; then
  echo "Backup successful for $DB_NAME on $DATE"
else
  echo "Error during backup of $DB_NAME on $DATE" >&2
fi

exit 0