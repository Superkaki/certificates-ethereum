pragma solidity ^0.4.13;

contract CertToken {
    
    struct Certificate {
        address owner;          // Public address of the certificate's owner (user or entity)
        address issuer;         // Public address of the entity who issues the certificate
        bytes32 certName;       // Name of the certificate issued
        address[] whiteList;    // List of authorized entities to check the certificate
        mapping(address => Entity) whiteListStruct;
        bool stilValid;
    }

    struct Entity {
        bytes32 name;           // Entity's name
    }

    struct User {
        bytes32 name;           // Owner's name
        //bytes32 surnames;       // Owner's surnames
        bytes32 nid;            // Owner's national identity document
    }

    address public newIssuer;
    uint public nounce;

    mapping(uint256 => Certificate) public certs;  // This creates an array with all the certificates

    mapping(address => User) public users;
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
    Create a new entity

    add             Addres of the new entity
    entityName      Name of the new entity
    /********************************************************************************************/
    function setEntity(address add, bytes32 entityName) public {
        entities[add].name = entityName;
    }

    /********************************************************************************************
    Create a new user

    add             Addres of the new user
    userName        Name of the new user
    userNid         New user's National Identity Card number
    /********************************************************************************************/
    function setUser(address add, bytes32 userName, bytes32 userNid) public {
        users[add].name = userName;
        users[add].nid = userNid;
    }

    /********************************************************************************************
    Get the name of an entity by its address

    add             Address of the entity to be searched
    /********************************************************************************************/
    function getEntityByAddress(address add) constant public returns (bytes32) {
        return entities[add].name;
    }

    /********************************************************************************************
    Get the info of a user by his address

    add             Address of the user to be searched
    /********************************************************************************************/
    function getUserByAddress(address add) constant public returns (bytes32, bytes32) {
        return (users[add].name, users[add].nid);
    }






    /*****************************************Functions*****************************************/
    /********************************************************************************************
    Create a new certificate to the blockcahin

    _to             Address of new certificate's owner
    certName        Name of the new certificate
    /********************************************************************************************/
    function newCert(address _to, bytes32 _certName) public returns (uint256 id) {
        //bytes32 unique = keccak256(nounce++);     // TODO: In the future the id will be a hash, not a uint256
        id = nounce++;

        certs[id].owner = _to;                // Addidng information
        certs[id].issuer = newIssuer;
        certs[id].certName = _certName;
        certs[id].stilValid = true;
        setEntityToWhiteList(id, _to);        // The owner is allowed to check his own certificate
        setEntityToWhiteList(id, msg.sender);       // The issuer is allowed to check the certificate
        
        return id;
    }
    
    /********************************************************************************************
    Check whether a certificate exist

    unique        Address of the certificate is gonna check
    /********************************************************************************************/
    function checkCert(uint256 unique) public view returns (bool success) {
        if (certs[unique].issuer != 0 ) {
            require(isSenderAllowed(unique));
            require(certs[unique].stilValid);
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
        
        for (uint256 i = 0; i < certs[unique].whiteList.length; i++) {
            if (certs[unique].whiteList[i] == msg.sender) {
                return(true);
            }
        }
        return (false);
    }
    
    /********************************************************************************************
    Add an entity to the whiteList

    unique          Address of the certificate is gonna check
    _newEntity      Address of the entity is gonna be added to the list
    /********************************************************************************************/
    function setEntityToWhiteList(uint256 unique, address _newEntity) public returns (bool success){
        if(msg.sender == certs[unique].owner || msg.sender == certs[unique].issuer) {
            certs[unique].whiteList.push(_newEntity);
            return true;
        }
        return false;
    }

    /********************************************************************************************
    Remove an entity from the whiteList

    unique          Address of the certificate is gonna check
    entity          Address of the entity is gonna be added to the list
    /********************************************************************************************
    function removeEntityFromWhiteList(uint256 unique, address entity) public returns (bool success) {
        if(msg.sender == certs[unique].owner || msg.sender == certs[unique].issuer || entity != certs[unique].issuer || entity != certs[unique].owner) {
            for (uint256 i = 0; i < certs[unique].whiteList.length; i++) {
                if (certs[unique].whiteList[i] == entity) {                     // Check if entity is in the list
                    for(uint256 j = i; j < certs[unique].whiteList.length-1; j++) {     // Remove from the array
                        certs[unique].whiteList[j] == certs[unique].whiteList[j+1];     //TODO: falla en esta linea
                    }
                    delete certs[unique].whiteList[certs[unique].whiteList.length-1];
                    return true;
                }
            }
        }
        return false;
    }
    */

    /********************************************************************************************
    Remove a certificate

    unique          Address of the certificate is gonna check
    /********************************************************************************************/
    function removeCertificate(uint256 unique) public returns (bool success) {
        if(msg.sender == certs[unique].owner || msg.sender == certs[unique].issuer) {
            certs[unique].stilValid = false;
            return true;
        }
        return false;
    }
}