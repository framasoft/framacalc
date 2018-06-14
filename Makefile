locales:
	yaml2po -P --progress=none -i app/locales/en.yml -o po/framapad.pot

push-locales: locales
	zanata-cli -q -B push

pull-locales:
	zanata-cli -q -B pull --min-doc-percent 75
	./.po2yml.sh

preview:
	npm run preview

build:
	npm run prod
