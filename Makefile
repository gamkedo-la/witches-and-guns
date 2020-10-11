.PHONY: run upload


run: node_modules
	npx browser-sync -f index.html -f js -f images -f sounds

dist: js images sounds
	npx webpack -p
	for f in `find images -type f \( -name "*.png" -o -name "*.gif" \)`; do cp --parents "$${f}" dist; done
	for f in `find sounds -type f \( -name "*.mp3" -o -name "*.ogg" \)`; do cp --parents "$${f}" dist; done

upload: dist
	butler push dist gonzalod/witch-gun:HTML5

node_modules:
	npm install --save-dev browser-sync webpack webpack-cli
