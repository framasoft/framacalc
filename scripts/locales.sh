#!/bin/bash
yaml2po -P --progress=none -i app/locales/en.yml -o po/${PWD##*/}.pot
for i in app/locales/*.yml
do
  j=$(echo $i | cut -d '.' -f 1   | cut -d '/' -f 3)
  yaml2po --progress=none -t app/locales/en.yml -i app/locales/$j.yml -o po/$j.po
done
