#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the ganache instance that we started (if we started one and if it's still running).
  if [ -n "$ganache_pid" ] && ps -p $ganache_pid > /dev/null; then
    kill -9 $ganache_pid
  fi
}
set -o allexport; source .env; set +o allexport
mnemonic="$REACT_APP_KEY_MNEMONIC"

ganache_running() {
  nc -z localhost 8545
}

start_ganache() {

  # Using 9000000 as gas limit and 10Gwei as gas price
  npx ganache-cli --gasLimit 0x895440 --gasPrice 0x2540BE400 -d -m "$mnemonic" -e 5000 > /dev/null &

  ganache_pid=$!

  echo "Waiting for ganache to launch..."

  while ! ganache_running; do
    sleep 0.1 # wait for 1/10 of the second before check again
  done

  echo "Ganache launched!"
}

if ganache_running; then
  echo "Using existing ganache instance"
else
  echo "Starting our own ganache instance"
  start_ganache
fi

npx truffle version
npx truffle compile --network development
rm .openzeppelin/dev-*.json ||:
npx oz push --network development
node scripts/copyContracts.js
rm src/config/contracts.json ||:
node scripts/deploy.js -- --network development
REACT_APP_ETH_NETWORKS=development,mainnet,kovan node scripts/loadDeployments.js
sleep 1
FORCE_COLOR=true REACT_APP_ETH_NETWORKS="development,mainnet,kovan" node scripts/start.js | cat
