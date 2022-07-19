#!/bin/bash

npm run build
rsync -av --progress .output root@194.67.109.88:/var/www/dev.ychanter.ru/services/client_nuxt3
