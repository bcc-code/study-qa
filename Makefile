include .env

upload:
	gsutil -m cp -R ./dist/* gs://bccm-static/study-qa/$(FOLDER)
	gsutil -m setmeta -r -h "Cache-control:no-cache, max-age=0" gs://bccm-static/study-qa/$(FOLDER)