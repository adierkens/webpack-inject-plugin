#!/bin/sh
git config --global user.email "adam@dierkens.com"
git config --global user.name "Adam Dierkens"
git config --global push.default matching

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