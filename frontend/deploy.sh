npm run build
sudo rm -r /var/www/backup/*
sudo cp -r /var/www/html/* /var/www/backup/
sudo rm -r /var/www/html/*
sudo cp -r dist/* /var/www/html/
