pragma solidity ^0.4.13;

contract CertToken {
    
    struct Entity {
        bytes32 name;           // Entity's name
    }

    struct User {
        bytes32 name;           // Owner's name
        bytes32 surnames;       // Owner's surnames
        bytes32 nid;            // Owner's national identity document
    }
    
    struct Certificate {
        address owner;          // Public address of the certificate's owner
        address issuer;         // Public address of the entity who issues the certificate
        bytes32 certName;       // Name of the certificate issued
        address[] whiteList;    // List of authorized entities to check certificate
    }

    address public addr1;
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
    }





    /************************************Getters and Setters*************************************/
    /********************************************************************************************
    Set a new certificate to the blockcahin

    newOwner        Address of new certificate's owner
    newCertName     Name of the certificate
    /********************************************************************************************/
    function setCert(address newOwner, bytes32 newCertName) public returns (bytes32) {
        bytes32 unique = keccak256(newOwner, nounce++);

        certs[unique].owner = newOwner;
        certs[unique].issuer = msg.sender;
        certs[unique].certName = newCertName;
        //certs[unique].whiteList[0] = newOwner;
        
        return unique;
    }





    /*****************************************Functions*****************************************/
    /********************************************************************************************
    Check whether a certificate exist

    certHash        Address of the certificate is gonna check
    /********************************************************************************************/
    function checkCert(bytes32 unique) public view returns (bool) {
        if (certs[unique].issuer != 0 ) {
            return true;
        }
        return false;
    }

}