 const SuperToken = artifacts.require('SuperToken');
const DaiToken = artifacts.require('DaiToken');
 const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(deployer, network, accounts) {

	//Deploy dai token
	await deployer.deploy(DaiToken)
	const daiToken = await DaiToken.deployed()

	//Deploy super token
	await deployer.deploy(SuperToken)
	const superToken = await SuperToken.deployed()

	//Deploy token farm
	await deployer.deploy(TokenFarm, superToken.address, daiToken.address)
	const tokenFarm = await TokenFarm.deployed()

	await superToken.transfer(tokenFarm.address, '1000000000000000000000000')

	await daiToken.transfer(accounts[1],'100000000000000000000')
}

