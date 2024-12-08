# Crowdfund webapp with Hardhat, React, EthersJS 

Web app built with React and etherjs using the Crowdfund smart contract on the
Hardhat local network. The app requires Metamask to run transactions. 

- React = frontend
- etherjs = backend and utility functions to connect the web app to the Ethereum
network, hence the smart contract
- Hardhat = framework for compiling, testing and deploying on a local network
- Metamask = wallet application and browser extension allowing you to 
communicate with web3 websites and perform transactions. 

===========================

Before start you shoud make sure the environment is OK.
1. install Node.js 
    choose the even version to install, namely Node.js LTS 
    If you install version of Node.js wrongly, use NVM to install a new one then swtich to Node.js LTS
2. Install the Metamask browser extension.

## Quick start

Install Hardhat local network(only once):

```sh
npm install --save-dev hardhat
```

Once installed, we can start this project by following these steps:

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

===========================

> Note: this example uses a custom deploy script, consider using `hardhat ignition` -
> Hardhat builtin deployment system

Connect Metamask to a local network through Settings > Networks > Add Network.
You might need to delete previously added network from Metamask and re-add it 
every time you start a new network instance. Please do so if you get "Transaction
#x failed! JSON-RPC error." in Metamask


Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm start
```

Open [http://localhost:3000/](http://localhost:3000/) to see your Dapp. You will
need to have [Metamask](https://metamask.io) installed and listening to
`localhost 8545`.

## Acknowledgements and other resources

This Dapp used the [Hardhat boilerplate project tutorial](https://hardhat.org/tutorial/boilerplate-project). as a starting point. Please refer to the tutorial and original repo for additional informations on how to use Hardhat with React, etherjs and Metamask.