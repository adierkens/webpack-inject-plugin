#!/bin/sh
VERSION=`auto version`

if [ ! -z "$VERSION" ]; then
  echo SemVer Bump: $VERSION

  ## Update Changelog
  auto changelog

  ## Publish Package
  npm version $VERSION -m "Bump version to: %s [skip ci]"
  npm publish

  ## Create Gitub Release
  git push --follow-tags --set-upstream origin $branch
  auto release
fi