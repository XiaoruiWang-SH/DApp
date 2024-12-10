# Auction System dapp with Hardhat, React, EthersJS, Node, Mysql

Auction system app built with React and etherjs using the smart contract on the
Hardhat local network and node server interacting with mysql database. The app requires Metamask to run transactions. 


## To run the Auction System on local, need the environments prerequistes:

* Node.js
    * install Node LTS (v22.12.0)
    * if you have many versions of Node, using NVM to switch node version
    * run "nvm install v22.12.0", then run "nvm use v22.12.0"

* Mysql
    * install mysql run:
        ```sh
        brew install mysql
        ```
    * Start the MySQL Service, run:
        ```sh
        brew services start mysql
        ```
    <!-- * Log in to MySQL, run:
        ```sh
        mysql -u root -p
        ```
    * Create a table named "auctiondb", run:
        ```sh
        CREATE DATABASE auctiondb;
        ```
    * Check is database is created successful, run:
        ```sh
        SHOW DATABASES;
        ``` -->

* Hardhat local network
    * Install Hardhat local network(only once):

        ```sh
        npm install --save-dev hardhat
        ```

* Metamask chrome browser extension
    * Create a local hardhat network: http://127.0.0.1:8545
    * Import test account


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

