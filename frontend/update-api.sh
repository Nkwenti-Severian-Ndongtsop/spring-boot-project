set -e

curl -s http://localhost:8000/v3/api-docs -o openapi.json

npx @openapitools/openapi-generator-cli generate \
  -i openapi.json \
  -g typescript-fetch \
  -o ./src/api \
  --skip-validate-spec

echo""
echo""
echo "----------------------------------------" >&2
echo "✅ OpenAPI client updated successfully!" >&2
echo "----------------------------------------" >&2 