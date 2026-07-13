#!/bin/bash
# gitlab_vars.sh
# Управление CI/CD переменными GitLab:
#   1. Скопировать переменные из существующего environment в новый
#   2. Загрузить переменные из .env файлов в нужный environment

set -e

# ── Настройки ─────────────────────────────────────────────────────────────────
GITLAB_URL=""
PROJECT_ID=""
TOKEN=""
ENV_FILES=".env @strapi/.env"
# ──────────────────────────────────────────────────────────────────────────────

# Поиск конфиг файла
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONF_FILE=""

for candidate in \
  "${SCRIPT_DIR}/gitlab_vars.conf" \
  "$(pwd)/gitlab_vars.conf"; do
  if [ -f "$candidate" ]; then
    CONF_FILE="$candidate"
    break
  fi
done

if [ -n "$CONF_FILE" ]; then
  echo "⚙️  Загружаю конфиг: $CONF_FILE"
  # shellcheck source=/dev/null
  source "$CONF_FILE"
else
  echo "⚠️  Конфиг не найден (gitlab_vars.conf) — используются дефолты"
fi

# Проверить обязательные параметры
errors=0
[ -z "$GITLAB_URL" ]  && echo "❌ GITLAB_URL не задан"  && errors=$((errors+1))
[ -z "$PROJECT_ID" ]  && echo "❌ PROJECT_ID не задан"  && errors=$((errors+1))
[ -z "$TOKEN" ]       && echo "❌ TOKEN не задан"       && errors=$((errors+1))
[ "$errors" -gt 0 ]   && echo "" && echo "Заполни gitlab_vars.conf и повтори." && exit 1

API="${GITLAB_URL}/api/v4/projects/${PROJECT_ID}"
AUTH="PRIVATE-TOKEN: ${TOKEN}"

# ── Вспомогательные функции ───────────────────────────────────────────────────

do_post() {
  local json_data="$1"
  local tmp_file
  tmp_file=$(mktemp)
  local code
  code=$(curl -s -o "$tmp_file" -w "%{http_code}" \
    --request POST \
    --header "$AUTH" \
    --header "Content-Type: application/json" \
    --data "$json_data" \
    "${API}/variables")
  echo "$code $(cat "$tmp_file")"
  rm -f "$tmp_file"
}

do_put() {
  local key="$1"
  local target_env="$2"
  local json_data="$3"
  local tmp_file
  tmp_file=$(mktemp)
  local code
  code=$(curl -s -o "$tmp_file" -w "%{http_code}" \
    --request PUT \
    --header "$AUTH" \
    --header "Content-Type: application/json" \
    --data "$json_data" \
    --globoff \
    "${API}/variables/${key}?filter[environment_scope]=${target_env}")
  echo "$code $(cat "$tmp_file")"
  rm -f "$tmp_file"
}

# Универсальная загрузка одной переменной с fallback логикой
upload_var() {
  local key="$1"
  local value="$2"
  local target_env="$3"
  local masked="${4:-false}"
  local protected="${5:-false}"
  local var_type="${6:-env_var}"

  local json_body json_body_nomask put_body put_body_nomask

  json_body=$(python3 -c "
import json, sys
print(json.dumps({
    'key':               sys.argv[1],
    'value':             sys.argv[2],
    'variable_type':     sys.argv[3],
    'masked':            sys.argv[4] == 'true',
    'protected':         sys.argv[5] == 'true',
    'environment_scope': sys.argv[6]
}))
" "$key" "$value" "$var_type" "$masked" "$protected" "$target_env")

  json_body_nomask=$(python3 -c "
import json, sys
print(json.dumps({
    'key':               sys.argv[1],
    'value':             sys.argv[2],
    'variable_type':     sys.argv[3],
    'masked':            False,
    'protected':         sys.argv[5] == 'true',
    'environment_scope': sys.argv[6]
}))
" "$key" "$value" "$var_type" "$masked" "$protected" "$target_env")

  put_body=$(python3 -c "
import json, sys
print(json.dumps({
    'value':             sys.argv[1],
    'variable_type':     sys.argv[2],
    'masked':            sys.argv[3] == 'true',
    'protected':         sys.argv[4] == 'true',
    'environment_scope': sys.argv[5]
}))
" "$value" "$var_type" "$masked" "$protected" "$target_env")

  put_body_nomask=$(python3 -c "
import json, sys
print(json.dumps({
    'value':             sys.argv[1],
    'variable_type':     sys.argv[2],
    'masked':            False,
    'protected':         sys.argv[4] == 'true',
    'environment_scope': sys.argv[5]
}))
" "$value" "$var_type" "$masked" "$protected" "$target_env")

  # Попытка 1: POST
  result=$(do_post "$json_body")
  http_code="${result%% *}"

  if [ "$http_code" = "201" ]; then
    echo "  ✓ создана:              $key"
    return 0
  fi

  # Попытка 2: PUT (уже существует)
  if [ "$http_code" = "400" ]; then
    result2=$(do_put "$key" "$target_env" "$put_body")
    http_code2="${result2%% *}"
    resp_body2="${result2#* }"

    if [ "$http_code2" = "200" ]; then
      echo "  ↺ обновлена:           $key"
      return 1  # 1 = updated
    fi

    # Попытка 3: POST без masked (значение несовместимо с маскировкой)
    if [ "$http_code2" = "404" ]; then
      result3=$(do_post "$json_body_nomask")
      http_code3="${result3%% *}"
      resp_body3="${result3#* }"

      if [ "$http_code3" = "201" ]; then
        echo "  ✓ создана (no mask):   $key"
        return 0
      fi

      echo "  ✗ ошибка:              $key (POST=$http_code PUT=$http_code2 POST_nomask=$http_code3)"
      echo "    $(echo "$resp_body3" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('message',''))" 2>/dev/null)"
      return 2  # 2 = failed
    fi

    echo "  ✗ ошибка PUT:          $key (HTTP $http_code2)"
    echo "    $(echo "$resp_body2" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('message',''))" 2>/dev/null)"
    return 2
  fi

  # Попытка 2б: неожиданный код — попробовать PUT
  result2b=$(do_put "$key" "$target_env" "$put_body")
  http_code2b="${result2b%% *}"
  if [ "$http_code2b" = "200" ]; then
    echo "  ↺ обновлена:           $key"
    return 1
  fi

  # Попытка 3б: POST без masked
  result3b=$(do_post "$json_body_nomask")
  http_code3b="${result3b%% *}"
  if [ "$http_code3b" = "201" ]; then
    echo "  ✓ создана (no mask):   $key"
    return 0
  fi

  # Попытка 4б: PUT без masked
  result4b=$(do_put "$key" "$target_env" "$put_body_nomask")
  http_code4b="${result4b%% *}"
  if [ "$http_code4b" = "200" ]; then
    echo "  ↺ обновлена (no mask): $key"
    return 1
  fi

  resp_body="${result#* }"
  echo "  ✗ ошибка:              $key (все попытки провалились, POST=$http_code)"
  echo "    $(echo "$resp_body" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('message',''))" 2>/dev/null)"
  return 2
}

# ── Режим 1: Копировать из существующего environment ─────────────────────────

mode_copy() {
  echo ""

  # Показать доступные environments
  echo "🔍 Загружаю список переменных из GitLab..."
  raw=$(curl -s \
    --header "$AUTH" \
    "${API}/variables?per_page=100")

  if [ -z "$raw" ]; then
    echo "❌ Пустой ответ. Проверь GITLAB_URL, PROJECT_ID и TOKEN"
    exit 1
  fi

  echo "$raw" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if isinstance(data, dict) and 'message' in data:
    print('❌ GitLab API ошибка:', data['message'])
    sys.exit(1)
envs = sorted(set(v.get('environment_scope','*') for v in data))
print('Доступные environments:')
for e in envs:
    count = sum(1 for v in data if v.get('environment_scope') == e)
    print(f'  • {e} ({count} переменных)')
" || exit 1

  echo ""
  read -rp "📌 Из какого environment копировать? " SOURCE_ENV < /dev/tty
  read -rp "📌 В какой environment записать?     " TARGET_ENV < /dev/tty
  [[ -z "$SOURCE_ENV" || -z "$TARGET_ENV" ]] && echo "❌ Environment не указан." && exit 1

  VARS_FILE="gitlab_vars_${SOURCE_ENV}.json"

  # Отфильтровать нужный environment
  echo "$raw" | python3 -c "
import sys, json
data = json.load(sys.stdin)
filtered = [v for v in data if v.get('environment_scope') == '${SOURCE_ENV}']
print(json.dumps(filtered, indent=2, ensure_ascii=False))
" > "$VARS_FILE"

  count=$(python3 -c "import json; print(len(json.load(open('${VARS_FILE}'))))")
  echo ""
  echo "── Переменные из '${SOURCE_ENV}': ${count} ──────────────────────────────"
  python3 -c "
import json
for v in json.load(open('${VARS_FILE}')):
    masked = '[MASKED]' if v.get('masked') else v.get('value','')[:40]
    print(f\"  {v['key']:<42} {masked}\")
"
  echo ""

  read -rp "⚠️  Скопировать ${count} переменных в environment '${TARGET_ENV}'? [y/N] " confirm < /dev/tty
  [[ "$confirm" != "y" && "$confirm" != "Y" ]] && echo "Отменено." && exit 0

  echo ""
  echo "📤 Копируем в environment: ${TARGET_ENV}"
  echo ""

  success=0; skipped=0; failed=0

  while IFS= read -r var <&3; do
    key=$(echo "$var"       | python3 -c "import sys,json; v=json.load(sys.stdin); print(v['key'])")
    value=$(echo "$var"     | python3 -c "import sys,json; v=json.load(sys.stdin); print(v.get('value',''))")
    masked=$(echo "$var"    | python3 -c "import sys,json; v=json.load(sys.stdin); print(str(v.get('masked',False)).lower())")
    protected=$(echo "$var" | python3 -c "import sys,json; v=json.load(sys.stdin); print(str(v.get('protected',False)).lower())")
    var_type=$(echo "$var"  | python3 -c "import sys,json; v=json.load(sys.stdin); print(v.get('variable_type','env_var'))")

    upload_var "$key" "$value" "$TARGET_ENV" "$masked" "$protected" "$var_type" && \
      success=$((success + 1)) || {
        code=$?
        [ "$code" = "1" ] && skipped=$((skipped + 1))
        [ "$code" = "2" ] && failed=$((failed + 1))
      }

  done 3< <(python3 -c "
import json
for v in json.load(open('${VARS_FILE}')):
    print(json.dumps(v))
")

  echo ""
  echo "── Итог ────────────────────────────────────────────────────────────"
  echo "  ✓ создано:   ${success}"
  echo "  ↺ обновлено: ${skipped}"
  echo "  ✗ ошибок:    ${failed}"
  echo "  📄 файл:     ${VARS_FILE}"
}

# ── Режим 2: Загрузить из .env файлов ────────────────────────────────────────

mode_upload() {
  echo ""
  read -rp "📌 В какой environment загрузить? " TARGET_ENV < /dev/tty
  [[ -z "$TARGET_ENV" ]] && echo "❌ Environment не указан." && exit 1
  echo ""

  # Парсим .env файлы через python — без declare -A, совместимо с bash 3 (macOS)
  VARS_JSON=$(python3 -c "
import os, re, json, sys

env_files = '${ENV_FILES}'.split()
result = {}   # key -> {value, source}

for path in env_files:
    if not os.path.isfile(path):
        print(f'⚠️  Файл не найден, пропускаю: {path}', file=sys.stderr)
        continue
    print(f'📂 Читаю: {path}', file=sys.stderr)
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.rstrip('\n')
            if not line or line.lstrip().startswith('#'):
                continue
            m = re.match(r'^([A-Za-z_][A-Za-z0-9_]*)=(.*)', line)
            if m:
                k, v = m.group(1), m.group(2)
                # Убрать кавычки
                if (v.startswith('\"') and v.endswith('\"')) or \
                   (v.startswith(\"'\") and v.endswith(\"'\")):
                    v = v[1:-1]
                result[k] = {'value': v, 'source': path}

print(json.dumps(result))
")

  total=$(echo "$VARS_JSON" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))")

  if [ "$total" -eq 0 ]; then
    echo "❌ Не найдено ни одной переменной."
    exit 1
  fi

  echo ""
  echo "── Найдено переменных: ${total} ────────────────────────────────────"
  echo "$VARS_JSON" | python3 -c "
import sys, json
data = json.load(sys.stdin)
rows = []
for k, v in data.items():
    display = v['value'][:40] + ('...' if len(v['value']) > 40 else '')
    rows.append((k, v['source'], display))
for k, src, val in sorted(rows):
    print(f'  {k:<42} [{src}]  {val}')
"
  echo ""

  read -rp "⚠️  Загрузить ${total} переменных в environment '${TARGET_ENV}'? [y/N] " confirm < /dev/tty
  [[ "$confirm" != "y" && "$confirm" != "Y" ]] && echo "Отменено." && exit 0

  echo ""
  echo "📤 Загружаем в environment: ${TARGET_ENV}"
  echo ""

  success=0; skipped=0; failed=0

  while IFS= read -r entry <&3; do
    key=$(echo "$entry"   | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['key'])")
    value=$(echo "$entry" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['value'])")

    upload_var "$key" "$value" "$TARGET_ENV" "false" "false" "env_var" && \
      success=$((success + 1)) || {
        code=$?
        [ "$code" = "1" ] && skipped=$((skipped + 1))
        [ "$code" = "2" ] && failed=$((failed + 1))
      }

  done 3< <(echo "$VARS_JSON" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for k, v in data.items():
    print(json.dumps({'key': k, 'value': v['value']}))
")

  echo ""
  echo "── Итог ────────────────────────────────────────────────────────────"
  echo "  ✓ создано:   ${success}"
  echo "  ↺ обновлено: ${skipped}"
  echo "  ✗ ошибок:    ${failed}"
}

# ── Главное меню ──────────────────────────────────────────────────────────────

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║        GitLab CI/CD Variables Manager           ║"
echo "╠══════════════════════════════════════════════════╣"
echo "║  1. Скопировать из существующего environment    ║"
echo "║  2. Загрузить из .env файлов репозитория        ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
read -rp "Выбери режим [1/2]: " mode < /dev/tty

case "$mode" in
  1) mode_copy ;;
  2) mode_upload ;;
  *) echo "❌ Неверный выбор. Введи 1 или 2." && exit 1 ;;
esac