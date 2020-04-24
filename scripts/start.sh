#!/usr/bin/env bash

npx truffle version
npx truffle compile && rm -rf contracts/build && mv build/contracts contracts/build/
node scripts/copyContracts.js
sleep 1
FORCE_COLOR=true node scripts/start.js | cat
