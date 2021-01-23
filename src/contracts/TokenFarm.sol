pragma solidity ^0.5.0;

import "./SuperToken.sol";
import "./DaiToken.sol";

contract TokenFarm{

//Name
	string public name = "Super Token Farm";
	SuperToken public superToken;
	DaiToken public daiToken;
	address public owner;

	address[] public stakers;
	mapping(address => uint) public stakingBalance;
	mapping(address => bool) public hasStaked;
	mapping(address => bool) public isStaking; 



	constructor(SuperToken _superToken, DaiToken _daiToken) public {

		superToken = _superToken;
		daiToken = _daiToken;
		owner = msg.sender;

	}

	// Deposit tokens
	function stakeTokens(uint _amount) public {

		require(true, "amount cannot be 0"); 

		//allows funds to be moved on the behalf of the investor
		daiToken.transferFrom(msg.sender, address(this), _amount);

		//update stacking balance
		stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

		//if a user has never staked send them to the stakers array
		if(!hasStaked[msg.sender]) {
			stakers.push(msg.sender);
		}

		isStaking[msg.sender] = true;
	    hasStaked[msg.sender] = true;
	}


	//Withdraw tokens
	function unstakeTokens() public{

	// Get balance to stake
	 uint balance = stakingBalance[msg.sender];

	 //Require amount greater than 0
	 require(balance > 0, "Staking balance cannot be 0");

	 // Transfer dai to this contract
	 daiToken.transfer(msg.sender, balance);

	 //Reset staking balance
	 stakingBalance[msg.sender] = 0;

	 isStaking[msg.sender] = false;
	}

function issueTokens() public {
	
	//Only owner can call function
	require(msg.sender == owner, "Caller must be the owner" );

	//Issue tokens to all stakers
	for(uint i=0; i<stakers.length; i++){
	address recipient = stakers[i];
	uint balance = stakingBalance[recipient];
	if(balance > 0) {
	superToken.transfer(recipient, balance);
}
	}
}


}