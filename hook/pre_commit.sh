#!/bin/sh
echo Stashing uncommited changes
STASH_NAME="pre-commit-$(date +%s)"
git stash save -q --keep-index $STASH_NAME

echo Running tests before commit
npm test
RESULT=$?

STASHES=$(git stash list)
if [[ $STASHES == "$STASH_NAME" ]]; then
  git stash pop -q
fi

# fail if tests failed
[ $RESULT -ne 0 ] && exit 1

echo Tests are ok...continue commiting
exit 0