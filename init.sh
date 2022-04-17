#!/usr/bin/env bash

echo "Installing dependencies..."
npm i
if [ $? -ne 0 ]; then
  echo "installation error"
  exit 1
fi

echo "Compiling smart contracts..."
npx hardhat compile
if [ $? -ne 0 ]; then
  echo "compilation error"
  exit 1
fi
