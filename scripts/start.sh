#!/usr/bin/env bash

node scripts/loadDeployments.js
sleep 1
FORCE_COLOR=true node scripts/start.js | cat
