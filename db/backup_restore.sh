#!/bin/bash

# Variables
DB_USER=root
DB_PASSWORD=root
DB_NAME=trello_db
BACKUP_DIR=backups_db
DB_HOST=mysql

# Créer le dossier de backup s'il n'existe pas
mkdir -p "$BACKUP_DIR"

# Trouver le dernier fichier de sauvegarde
LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/*.sql | head -n 1)

# Vérifier si un fichier de sauvegarde existe
if [ -f "$LATEST_BACKUP" ]; then
  echo "Restauration de la base de données à partir de $LATEST_BACKUP"
  mysql -h $DB_HOST -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$LATEST_BACKUP"

  if [ $? -eq 0 ]; then
    echo "Restauration réussie."
  else
    echo "Erreur lors de la restauration." >&2
  fi
else
  echo "Aucune sauvegarde trouvée dans $BACKUP_DIR" >&2
fi
