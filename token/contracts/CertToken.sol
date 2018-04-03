pragma solidity ^0.4.13;

contract CertToken {
    
    struct Certificate {
        address owner;          // Public address of the certificate's owner
        address issuer;         // Public address of the entity who issues the certificate
        bytes32 certName;       // Name of the certificate issued
        address[] whiteList;    // List of authorized entities to check the certificate
        mapping(address => Entity) whiteListStruct;
        uint256 nAllowed;       // Number of authorized entities
    }

    struct Entity {
        bytes32 name;           // Entity's name
    }

    struct User {
        bytes32 name;           // Owner's name
        bytes32 surnames;       // Owner's surnames
        bytes32 nid;            // Owner's national identity document
    }

    address public newIssuer;
    uint public nounce;

    mapping(uint256 => Certificate) public certs;  // This creates an array with all the certificates

    mapping(address => User) public owners;
    mapping(address => Entity) public entities;
     
    /********************************************Events******************************************/





    /***************************************Initializations**************************************/
    /********************************************************************************************
    Initializes contract with initial supply tokens to the creator of the contract
    /********************************************************************************************/
    function CertToken() public {
        nounce = 0;
        newIssuer = msg.sender;
        
    }

    /************************************Getters and Setters*************************************/
    /********************************************************************************************
    Set a new certificate to the blockcahin

    newOwner        Address of new certificate's owner
    newCertName     Name of the certificate
    /********************************************************************************************/
    function setCert(address _newOwner, bytes32 _newCertName) public returns (uint256 id) {
        //bytes32 unique = keccak256(nounce++);     // TODO: In the future the id will be a hash, not a uint256
        id = nounce++;

        certs[id].owner = _newOwner;                // Addidng information
        certs[id].issuer = newIssuer;
        certs[id].certName = _newCertName;
        setEntityToWhiteList(id, _newOwner);        // The owner is allowed to check his own certificate
        setEntityToWhiteList(id, msg.sender);       // The issuer is allowed to check the certificate
        
        return id;
    }





    /*****************************************Functions*****************************************/
    /********************************************************************************************
    Check whether a certificate exist

    unique        Address of the certificate is gonna check
    /********************************************************************************************/
    function checkCert(uint256 unique) public view returns (bool success) {
        if (certs[unique].issuer != 0 ) {
            require(isSenderAllowed(unique));
            return true;
        } else {
            return false;
        }
    }

    /********************************************************************************************
    Check whether the sender is allowed to check a certificate existence

    unique        Address of the certificate is gonna check
    /********************************************************************************************/
    function isSenderAllowed(uint256 unique) public view returns (bool isAllowed) {
        
        for (uint i = 0; i < certs[unique].nAllowed; i++) {
            if (certs[unique].whiteList[i] != msg.sender) {
                isAllowed = false;
            } else {
                isAllowed = true;                
            }
        }
        return isAllowed;
    }
    
    /********************************************************************************************
    Add an entity to the whiteList

    unique          Address of the certificate is gonna check
    _newEntity      Address of the entity is gonna be added to the list
    /********************************************************************************************/
    function setEntityToWhiteList(uint256 unique, address _newEntity) public {
        if(msg.sender == certs[unique].owner || msg.sender == certs[unique].issuer) {
            certs[unique].whiteList.push(_newEntity);
            certs[unique].nAllowed++;
        }
    }

}