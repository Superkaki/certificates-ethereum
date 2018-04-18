pragma solidity ^0.4.13;

contract CertToken {
    
    struct Certificate {
        address owner;          // Public address of the certificate's owner (user or entity)
        address issuer;         // Public address of the entity who issues the certificate
        string certName;        // Name of the certificate issued
        string certType;            // Short description of the certificate
        address[] whiteList;    // List of authorized entities to check the certificate
        mapping(address => Entity) whiteListStruct;
        uint creationDate;
        uint expirationDate;
        bool isStilValid;
    }

    struct Entity {
        bytes32 name;           // Entity's name
    }

    struct User {
        bytes15 name;           // Owner's name
        //bytes32 surnames;       // Owner's surnames
        bytes9 nid;             // Owner's national identity document
    }

    struct AccessLog {
        uint date;              // Timestamp of the access
        address user;           // Address of the user who applies for the verification
        bytes32 certificate;    // Hash of the certificate which was verified
    }

    AccessLog[] public history;
    uint public nounce;

    mapping(bytes32 => Certificate) public certs;  // This creates an array with all the certificates

    mapping(address => User) public users;
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
    Get my own address
    /********************************************************************************************/
    function getMyAddress() constant public returns (address) {
        return msg.sender;
    }

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
    function setUser(address add, bytes15 userName, bytes9 userNid) public {
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

    //TODO: Get entity's and user's address by then names if it's possible






    /*****************************************Functions*****************************************/
    /********************************************************************************************
    Create a new certificate to the blockcahin

    _to             Address of new certificate's owner
    certName        Name of the new certificate
    duration        Duration of the certificate's validity (seconds)
    /********************************************************************************************/
    function newCert(address _to, string _certType, string _certName, uint duration) public returns (bytes32 unique) {
        unique = keccak256(msg.sender, nounce++, _certName);

        certs[unique].owner = _to;                      // Addidng information
        certs[unique].issuer = msg.sender;
        certs[unique].certType = _certType;
        certs[unique].certName = _certName;
        certs[unique].creationDate = now;
        certs[unique].expirationDate = certs[unique].creationDate + duration;
        certs[unique].isStilValid = true;
        setEntityToWhiteList(unique, _to);              // The owner is allowed to check his own certificate
        setEntityToWhiteList(unique, msg.sender);       // The issuer is allowed to check the certificate
        
        return unique;
    }
    
    /********************************************************************************************
    Check whether a certificate exist

    unique        Address of the certificate is gonna check
    /********************************************************************************************/
    function checkCert(bytes32 unique) public returns (bool success) {
        if (certs[unique].issuer != 0) {                // Check if certificate exist
            insertHistory(unique);                      // Regist the appication
            require(isSenderAllowed(unique));
            checkExpiration(unique);
            require(certs[unique].isStilValid);
            return true;
        }
        return false;
    }

    /********************************************************************************************
    Check whether the sender is allowed to check a certificate existence

    unique        Address of the certificate is gonna be checked
    /********************************************************************************************/
    function isSenderAllowed(bytes32 unique) public view returns (bool isAllowed) {
        
        for (uint256 i = 0; i < certs[unique].whiteList.length; i++) {
            if (certs[unique].whiteList[i] == msg.sender) {
                return(true);
            }
        }
        return (false);
    }

    /********************************************************************************************
    Check if the certificate is expired

    unique        Address of the certificate is gonna be checked
    /********************************************************************************************/
    function checkExpiration(bytes32 unique) public returns (bool isValid) {
        if (certs[unique].expirationDate < now) {
            certs[unique].isStilValid = false;
            return false;
        }
        return true;
    }
    
    /********************************************************************************************
    Add an entity to the whiteList

    unique          Address of the certificate is gonna check
    _newEntity      Address of the entity is gonna be added to the list
    /********************************************************************************************/
    function setEntityToWhiteList(bytes32 unique, address _newEntity) public returns (bool success) {
        if(msg.sender == certs[unique].owner || msg.sender == certs[unique].issuer) {
            certs[unique].whiteList.push(_newEntity);
            return true;
        }
        return false;
    }

    /********************************************************************************************
    Insert a new access log in the history registration

    unique          Address of the certificate is gonna regist
    /********************************************************************************************/
    function insertHistory(bytes32 unique) public returns (bool success) {
        history.push(AccessLog({
            date: now,
            user: msg.sender,
            certificate: unique
        }));
        return true;
    }

    /********************************************************************************************
    Remove an entity from the whiteList

    unique          Address of the certificate is gonna check
    entity          Address of the entity is gonna be added to the list
    /********************************************************************************************
    function removeEntityFromWhiteList(bytes32 unique, address entity) public returns (bool success) {
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
    function removeCertificate(bytes32 unique) public returns (bool success) {
        if(msg.sender == certs[unique].owner || msg.sender == certs[unique].issuer) {
            certs[unique].isStilValid = false;
            return true;
        }
        return false;
    }
}