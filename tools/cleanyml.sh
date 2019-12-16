#!/bin/bash
yml=./tmp/yml
json=./tmp/json
aclean=./tmp/aclean
clean=./tmp/clean

# Create a new working folder
# and works on copied files
rm -rf $aclean
rm -rf $clean
rm -rf $json
rm -rf $yml
mkdir -p $yml
cp -r ../app/locales/* $yml

for i in $yml/*/
do
  lg=$(echo $i | cut -d '/' -f 4)
  mkdir -p $json/$lg
  mkdir -p $clean/$lg
  mkdir -p $aclean/$lg
  for j in $yml/$lg/*.yml
  do
  filename=$(echo $j | cut -d '/' -f 5 | cut -d '.' -f 1 )

  # yml2json
  js-yaml $yml/$lg/$filename.yml > $json/$lg/$filename.json
  # json2yml
  js-yaml $json/$lg/$filename.json > $aclean/$lg/$filename.yml
  # replace block folded (>) by block literal (|)
  sed -i 's/: >[-]*$/: |-/g' $aclean/$lg/$filename.yml
  sed -i 's/^>[-]*$/|-/g' $aclean/$lg/$filename.yml
  # and remove duplicate newlines
  sed ':a;N;$!ba;s/\n\n/\n/g' $aclean/$lg/$filename.yml > $clean/$lg/$filename.yml
  # show results and copy files
  if ((`stat -c%s $clean/$lg/$filename.yml` > 10));
  then
    echo -e "\033[0;32m✔️\033[0m $lg/$filename `stat -c%s $clean/$lg/$filename.yml`b"
    cp $clean/$lg/$filename.yml ../app/locales/$lg/$filename.yml
  else
    echo -e "\033[0;31m✘\033[0m $lg/$filename"
  fi
  done
done
# rm -rf ./tmp