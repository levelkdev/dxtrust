#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

# FORCE_COLOR=true REACT_APP_ETH_NETWORKS="develop,mainnet,kovan" node scripts/start.js | cat

FORCE_COLOR=true node scripts/start.js | cat
