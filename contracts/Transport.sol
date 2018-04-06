pragma solidity ^0.4.18;


contract TransportHeadquarter {
    
    TransportCenter[] public transportcenters;
    function getCenterCount() public view returns(uint CenterCount){
	    return transportcenters.length;
    }
        
    function mintTransportCenter(uint16 howmany) public payable{
    	for (uint i = 0; i < howmany; i++){
		TransportCenter newcenter = TransportCenter(i + 1);
		transportcenters.push(newcenter);
	}
    } 
}


contract TransportCenter {
    
    uint16 centerId;
    string name;
    uint8 occupationPercentage;
    address public adminAddress;
    address[] public neighbourAddress;
        
    event Created (string nonce, address[] centers, uint256 time);
    event CenterCreated (uint16 id, uint256 time);
    event Recieved (string nonce, address myaddress, uint256 time);
    event Sent (string nonce, address myaddress, uint256 time);
    event Delivered(string nonce);

   

    //Checks as Modifiers
    modifier onlyAdmin() {
        require(msg.sender == adminAddress);
        _;
    }
    
    function TransportCenter(uint16 _centerId) public {
	    centerId = _centerId;
	    adminAddress = msg.sender;
	    emit CenterCreated(centerId, block.timestamp);
    }
    //link centers that are neighbour to each other
    function twowayLink(address neighbour) public onlyAdmin {
        neighbourAddress.push(neighbour);
    }

    function newitem(string _trackingnonce,  address[] _centers) public {
	    emit Created(_trackingnonce, _centers, block.timestamp); 
    }
    
    function receive(string _trackingnonce) public {
        emit Recieved(_trackingnonce, address(this), block.timestamp);
    }

    function send(string _trackingnonce) public {
	    emit Sent(_trackingnonce, address(this), block.timestamp); 
    }

    function deliver(string _trackingnonce) public {
        emit Delivered(_trackingnonce);
    }
    
    function askforhelpfromneighbour() public {
    
    }

    function helpneighbour() public {

    }
}


