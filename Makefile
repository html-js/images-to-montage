# Maintainer helpers. The page itself needs none of this: open index.html.
PORT ?= 8000
# The screenshot driver is not a project dependency; reuse the copy npx keeps in its cache.
PW := $(shell find $$HOME/.npm/_npx -maxdepth 4 -type d -path '*/node_modules/playwright' 2>/dev/null | head -1)

.PHONY: help serve shots figures

help: ## list targets
	@grep -E '^[a-z]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-8s %s\n", $$1, $$2}'

serve: ## preview at http://127.0.0.1:8000/ (override with PORT=); ?src= sample links work here
	python3 -m http.server $(PORT) --bind 127.0.0.1

# shots also repaints docs/samples/ and re-exports docs/example-montage.jpg,
# which fig-export embeds, so run figures after it.
shots: ## regenerate samples, screenshots and the example export with one headless browser
	@test -n "$(PW)" || { echo "cache it first: npx -y playwright --version"; exit 1; }
	NODE_PATH="$(dir $(PW))" node docs/shot.js

figures: ## rebuild docs/figures/*.png from their .typ sources (needs the Nimbus Mono PS and C059 fonts)
	for f in docs/figures/fig-*.typ; do typst compile --root docs --ppi 200 "$$f" "$${f%.typ}.png"; done
