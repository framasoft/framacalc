backup-locales:
	mkdir -p tools/backup/
	cp -r app/locales/* tools/backup/

restore-locales:
	cp -r tools/backup/* app/locales/

clean-locales: backup-locales
	cd tools && ./cleanyml.sh

diff-locales:
	(meld app/locales/ tools/backup/ &)

preview:
	npm run preview

build:
	npm run prod
