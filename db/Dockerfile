# Utiliser l'image Ubuntu comme base
FROM ubuntu:latest

# Mettre à jour les paquets et installer cron, coreutils, mysql et bash (si nécessaire)
RUN apt-get update && apt-get install -y cron coreutils bash mysql-client && apt-get clean

# Copier les scripts de sauvegarde dans le conteneur
COPY ./backup_mysql.sh /backup_mysql.sh
COPY ./backup_restore.sh /backup_restore.sh
COPY ./backups_db /backups_db
COPY ./wait-for-it.sh /wait-for-it.sh

# Créer le fichier cron
RUN echo "0 0 * * 0 /backup_mysql.sh" > /etc/cron.d/backup && \
    chmod 0644 /etc/cron.d/backup && \
    crontab /etc/cron.d/backup

CMD  /wait-for-it.sh mysql:3306 -t 60 && ./backup_restore.sh
