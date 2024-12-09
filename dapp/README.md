# Auction System dapp with Hardhat, React, EthersJS, Node, Mysql

Auction system app built with React and etherjs using the smart contract on the
Hardhat local network and node server interacting with mysql database. The app requires Metamask to run transactions. 


## To run the Auction System on local, needing the environments prerequistes:

* Node.js
* Mysql
* Hardhat local network
* Metamask chrome browser extension


<!-- - React = frontend
- etherjs = backend and utility functions to connect the web app to the Ethereum
network, hence the smart contract
- Hardhat = framework for compiling, testing and deploying on a local network
- Metamask = wallet application and browser extension allowing you to 
communicate with web3 websites and perform transactions.  -->


<!-- 1. install Node.js 
    choose the even version to install, namely Node.js LTS 
    If you install version of Node.js wrongly, use NVM to install a new one then swtich to Node.js LTS
2. Install the Metamask browser extension. -->

## Quick start

Before start you shoud create localhost network(localhost 8545) in MetaMask. And import some test account, make them active.

<!-- Install Hardhat local network(only once):

```sh
npm install --save-dev hardhat
``` -->

Then following steps below to run this app:

Enter into dapp directory:

Step 1: Start Hardhat local network:

```sh
npm run hardhat-node
```

Step 2: Run deploy script:

```sh
npm run deploy-localhost
```

Step 3: Start node server: 
```sh
npm run start-node
```

Step 4: Start frontend code: 

```sh
npm run start-frontend
```

