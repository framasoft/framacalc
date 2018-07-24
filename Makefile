locales:
	scripts/locales.sh

push-locales: locales
	zanata-cli -q -B push

pull-locales:
	zanata-cli -q -B pull --min-doc-percent 75
	./scripts/po2yml.sh

preview:
	npm run preview

build:
	npm run prod
