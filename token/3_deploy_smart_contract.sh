#!/bin/bash

#echo "Init the contract"
#truffle init

echo "Compile the contract"
truffle compile

echo "Once the compile has completed, deploy the contract to the blockchain"
truffle migrate ---reset

echo "Configure METAMASK to listen at: http://172.17.0.2:8546"

#echo "...."
#echo "Running default web application..."
#npm run dev