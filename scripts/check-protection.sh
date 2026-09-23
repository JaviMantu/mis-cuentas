#!/usr/bin/env bash
# work/008 · AC-008.4: main exige 1 aprobación y los checks check + smoke, también para administradores.
set -euo pipefail
repo="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
p="$(gh api "repos/$repo/branches/main/protection")"
ok=1
[ "$(jq -r '.required_pull_request_reviews.required_approving_review_count // 0' <<<"$p")" -ge 1 ] || { echo "FAIL  falta exigir 1 aprobación"; ok=0; }
for c in check smoke; do jq -e --arg c "$c" '.required_status_checks.contexts | index($c)' <<<"$p" >/dev/null || { echo "FAIL  falta el check requerido $c"; ok=0; }; done
[ "$(jq -r '.enforce_admins.enabled' <<<"$p")" = "true" ] || { echo "FAIL  la protección no aplica a administradores"; ok=0; }
[ "$ok" = 1 ] && echo "protection PASS · $repo main" || exit 1
