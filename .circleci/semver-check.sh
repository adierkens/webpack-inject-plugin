#!/bin/sh

if [ ! -z "$CIRCLE_PR_NUMBER" ]; then
  auto pr-check --pr "$CIRCLE_PR_NUMBER" --url "$CIRCLE_PULL_REQUEST"
fi
