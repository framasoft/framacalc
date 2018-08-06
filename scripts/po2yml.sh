#!/bin/bash
cp ./app/locales/en.yml ./po/template.yml
for i in po/*.po
do
    j=$(echo $i | cut -d '.' -f 1   | cut -d '/' -f 2)
    po2yaml -i $i --progress none -t po/template.yml -o app/locales/$j.yml
done
