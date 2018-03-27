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
        address owner;          // Address of the certificate's owner
        address issuer;         // Address of the entity who issues the certificate
        bytes32 certName;       // Name of the certificate issued
        address[] whiteList;    // List of authorized entities to check certificate
    }

    Entity public newIssuer;

    mapping(address => User) public owners;
    mapping(address => Entity) public entities;
    mapping (address => Certificate) public certificates;     // This creates an array with all the entities
     
    /********************************************Events******************************************/





    /***************************************Initializations**************************************/
    /********************************************************************************************
    Initializes contract with initial supply tokens to the creator of the contract
    /********************************************************************************************/
    function CertToken() public {

    }





    /************************************Getters and Setters*************************************/







    /*****************************************Functions*****************************************/







}