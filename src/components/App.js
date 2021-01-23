import React, { Component } from 'react'
import { PropTypes } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import SuperToken from '../abis/SuperToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {
 
 //Web3 Connects application with blockchain
async componentWillMount(){
  await this.loadWeb3()
  await this.loadBlockchainData()
}

// Fetches data from the blockchain
async loadBlockchainData(){
  const web3 = window.web3

  //List account number 
  const accounts = await web3.eth.getAccounts()
  this.setState({ account: accounts[0]})

  //Connects the app with the ganache network
  const networkId = await web3.eth.net.getId()
   


  //Load Dai Token and create web3 version
  const daiTokenData = DaiToken.networks[networkId]
  if(daiTokenData){
    const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
    this.setState({ daiToken})
    let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
    this.setState({ daiTokenBalance: daiTokenBalance.toString() })
  

  }

  else {
    window.alert('DaiToken contract not deployed to network.')
  }


//Load super token
const superTokenData = SuperToken.networks[networkId]
  if(superTokenData){
    const superToken = new web3.eth.Contract(SuperToken.abi, superTokenData.address)
    this.setState({ superToken })
    let superTokenBalance = await superToken.methods.balanceOf(this.state.account).call()
    this.setState({ superTokenBalance: superTokenBalance.toString() })
  }
  else {
    window.alert('SuperToken contract not deployed to network.')
  }

//Load token farm
const tokenFarmData = TokenFarm.networks[networkId]
  if(tokenFarmData){
    const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
    this.setState({ tokenFarm })
    let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
    this.setState({ stakingBalance: stakingBalance.toString() })
  }
  else {
    window.alert('SuperToken contract not deployed to network.')
  }


//Once data is fetched from blockchain loading is done
this.setState({ loading: false })



}

async loadWeb3(){
  if(window.ethereum){
  window.web3 = new Web3(window.ethereum)
  await window.ethereum.enable()
  }
  else if (window.web3){
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else{
    window.alert('Non-Ethereum browser detected. Consider Metamask for google chrome')
  }
}


stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }


constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      superToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      superTokenBalance: '0',
      stakingBalance: '0',
      loading: true

    }
  }


//functions must be passed here
  render() {


    let content 
    if(this.state.loading) {  
      content = <p id="loader" className="text-center">Loading...</p>
    }
    else{
      content = <Main 
      daiTokenBalance={this.state.daiTokenBalance}
      superTokenBalance={this.state.superTokenBalance}
      stakingBalance={this.state.stakingBalance}
      stakeTokens={this.stakeTokens}
      unstakeTokens={this.unstakeTokens}
      />
    }


    return (
      <div>
      <span>Account</span>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                { content }

                <h1></h1>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
