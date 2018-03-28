pragma solidity ^0.4.13;

contract CertToken {
    
    struct Certificate {
        address owner;          // Public address of the certificate's owner
        address issuer;         // Public address of the entity who issues the certificate
        bytes32 certName;       // Name of the certificate issued
        address[] whiteList;    // List of authorized entities to check certificate
        mapping(address => Entity) whiteListStruct;
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

    mapping(bytes32 => Certificate) public certs;  // This creates an array with all the certificates

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
    function setCert(address _newOwner, bytes32 _newCertName) public returns (bytes32) {
        bytes32 unique = keccak256(nounce++);

        certs[unique].owner = _newOwner;
        certs[unique].issuer = newIssuer;
        certs[unique].certName = _newCertName;
        certs[unique].whiteList.push(_newOwner);
        
        return unique;
    }




    /*****************************************Functions*****************************************/
    /********************************************************************************************
    Check whether a certificate exist

    certHash        Address of the certificate is gonna check
    /********************************************************************************************/
    function checkCert(bytes32 unique) public view returns (bool) {
        if (certs[unique].issuer != 0 ) {
            require(certs[unique].whiteListStruct[msg.sender].name != "");
            //require(isSenderAllowed(unique));
        }
        return false;
    }

    /*
    function isSenderAllowed(bytes32 unique) public view returns (bool isAllowed) {
        
        for (uint i = 0; i < certs[unique].whiteList.lenght; i++) {
            if (certs[unique].whiteList[i] != msg.sender) {
                isAllowed = false;
            } else {
                isAllowed = true;                
            }
        }
        return isAllowed;
    }
    */

    function setEntityToWhiteList(bytes32 unique,address _newEntity) public {
        certs[unique].whiteList.push(_newEntity);
    }

}