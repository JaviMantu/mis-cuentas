# Mis Cuentas: un solo proyecto. Definición de hecho = make check. Producción = merge a main (no hay target de prod).
.PHONY: help test accept eval check serve smoke deploy-check

help:
	@echo "make test          unit (node --test)"
	@echo "make accept        aceptación (Playwright, escritorio y móvil)"
	@echo "make eval          evals del repo (trazabilidad, políticas, hooks)"
	@echo "make deploy-check  valida vercel.json y el hash CSP del script inline"
	@echo "make check         test + accept + eval + deploy-check = definición de hecho"
	@echo "make serve         http://localhost:4173"
	@echo "make smoke URL=…   smoke contra una URL desplegada (preview o producción)"

test:
	node --test tests/unit/*.test.js

accept:
	npx playwright test

eval:
	node evals/run.mjs --root .

deploy-check:
	node scripts/check-deploy.mjs

check: test accept eval deploy-check
	@echo "check OK · mis-cuentas"

serve:
	node scripts/serve.mjs src

smoke:
	@test -n "$(URL)" || (echo "uso: make smoke URL=https://…" && exit 2)
	BASE_URL=$(URL) npx playwright test --config tests/smoke/playwright.smoke.config.mjs
