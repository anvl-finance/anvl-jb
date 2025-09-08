surge build abrasive-aunt.surge.sh

COMMIT=$(git rev-parse HEAD)

[[ -d anvl-finance.github.io ]] && {
  pushd anvl-finance.github.io
  cp -r ../build/* .
  git add .
  git commit --allow-empty -m "$COMMIT"
  git push
}
