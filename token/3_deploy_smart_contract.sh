#!/bin/bash

#echo "Init the contract"
#truffle init

echo "Compile the contract"
truffle compile

echo "Once the compile has completed, deploy the contract to the blockchain"
truffle migrate

echo "Configure METAMASK to listen at: http://127.0.0.1:9545"

#echo "...."
#echo "Running default web application..."
#npm run dev