#!/usr/bin/env bash

npx truffle version
npx truffle compile
node scripts/copyContracts.js
node scripts/loadDeployments.js
sleep 1
FORCE_COLOR=true node scripts/start.js | cat
