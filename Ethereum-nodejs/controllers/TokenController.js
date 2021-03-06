var contract = require('truffle-contract');
var contractConfig = require('../config/contract.config').default;
var artifacts = require('../build/contracts/AssetTransfer.json');
var StandardToken = contract(artifacts);
var Wallet = contractConfig.Wallet;

class TokenController {
  constructor() {
    try {
      if (contractConfig.isWeb3Connected()) {
        this._web3 = contractConfig._web3;
        this.StandardToken = StandardToken;
        this.init();
      } else {
        console.error("Web3 not connected to any ethereum node over HTTP");
        return;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async init() {
    this.StandardToken.setProvider(this._web3.currentProvider);
    this.StandardToken.setNetwork(contractConfig.NETWORK_ID);
    this._accounts = await this._web3.eth.accounts;
    this._instance = await this.StandardToken.at(contractConfig.CONTRACT_ADDRESS.AssetTransferContract);
    // this._web3.eth.defaultAccount = this._accounts[0];
    // this._gas = {
    //   from: this._accounts[0],
    //   gas: contractConfig.getGasLimit() //9000000000000
    // }
    this.setGas(this._accounts[0]);
  }

  setGas(account) {
    if (!account || account === undefined) {
      throw new Error('Account doesnot exist');
    }
    this._gas = {
      from: account,
      gas: contractConfig.getGasLimit() //9000000000000
    }
  }

  async transfer(_from, _to, _value) {
    var transaction = await this._instance.transferFrom(_from, _to, _value, this._gas);
    return transaction;
  }

  async transferTokens(_from, _to, _value) {
    var transaction = await this._instance.transferTokens(_from, _to, _value, this._gas);
    return transaction;
  }

  async allowed(_owner, _spender) {
    var transaction = await this._instance.allowance(_owner, _spender, this._gas);
    return transaction;
  }

  async mintTokens(_value) {
    var transaction = await this._instance.mint(_value, this._gas);
    return transaction;
  }

  async getTokenDetails() {
    var details = await this._instance.tokenDetails();
    return details;
  }

  async balanceOf(_address) {
    return await this._instance.balanceOf(_address, this._gas);
  }
}
var tokenController = new TokenController();
module.exports = {
  tokenController
}