pragma solidity ^0.4.13;

contract CertToken {
    
    struct Certificate {
        address[] ownerList;    // Public address of the certificate's owner (user or entity)
        address issuer;         // Public address of the entity who issues the certificate
        string certName;        // Name of the certificate issued
        string certType;        // Short description of the certificate
        address[] whiteList;    // List of authorized entities to check the certificate
        uint creationDate;
        uint expirationDate;
        bool isStilValid;
    }

    struct User {
        //bytes10 type;           // Type of user: Entity or Individual
        bytes15 name;               // Owner's name
        //bytes32 surnames;       // Owner's surnames
        bytes9 nid;                 // Owner's national identity document
        bytes32[] ownCertsList;     // List of certificates owned by that user
        bytes32[] accessLogList;
    }

    struct AccessLog {
        uint date;              // Timestamp of the access
        address user;           // Address of the user who applies for the verification
        bytes32 certificate;    // Hash of the certificate which was verified
        // bool hadSuccess;
    }

    uint public nounce;
    
    mapping(bytes32 => AccessLog) public accessLogs;  // This creates an array with all the certificates
    mapping(bytes32 => Certificate) public certs;  // This creates an array with all the certificates

    mapping(address => User) public users;
    
    
    
    /********************************************Events******************************************/
    /********************************************************************************************
    Useful for saving information about blocks
    /********************************************************************************************/
    // event certList(bytes32[] certUnique);
    event newCertCreated(bytes32 certUnique,  address sender, string certType, string certName, uint creationDate, uint expirationDate);
    // event checkOk(bytes32 certUnique, address sender, uint creationDate, bool success);



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
//    function setEntity(address add, bytes32 entityName) public {
//        entities[add].name = entityName;
//    }

    /********************************************************************************************
    Create a new user

    add             Addres of the new user
    userName        Name of the new user
    userNid         New user's National Identity Card number
    /********************************************************************************************/
    function setUser(address add, bytes15 userName, bytes9 userNid) public returns (bool success) {
        users[add].name = userName;
        users[add].nid = userNid;
        return (true);
    }

    /********************************************************************************************
    Get the list of certificates owned by a user
    /********************************************************************************************/
    function getCertList(address add) public view returns (bytes32[] ownCertsList) {
        return (users[add].ownCertsList);
    }

    /********************************************************************************************
    Get a certificate by knowing its hash
    /********************************************************************************************/
    function getCertByHash(bytes32 certUnique) public view returns (bytes32, address, string, string, uint, uint, bool) {
        if(certs[certUnique].isStilValid) {
            checkExpiration(certUnique);            // Check if certificate has expired
        }
        return (certUnique,
        certs[certUnique].issuer, 
        certs[certUnique].certType, 
        certs[certUnique].certName,
        certs[certUnique].creationDate,
        certs[certUnique].expirationDate,
        certs[certUnique].isStilValid);
    }

    /********************************************************************************************
    Get the access log list of certificates
    /********************************************************************************************/
    function getAccessLogList(address add) public view returns (bytes32[] accessLogList) {
        return (users[add].accessLogList);
    }

    /********************************************************************************************
    Get an access log by knowing its hash
    /********************************************************************************************/
    function getAccessLogByHash(bytes32 accessLogUnique) public view returns (bytes32, uint, address, bytes32) {
        return (accessLogUnique,
        accessLogs[accessLogUnique].date, 
        accessLogs[accessLogUnique].user, 
        accessLogs[accessLogUnique].certificate);
    }

    /********************************************************************************************
    Get the name of an entity by its address

    add             Address of the entity to be searched
    /********************************************************************************************/
//    function getEntityByAddress(address add) constant public returns (bytes32) {
//        return entities[add].name;
//    }

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
    certType        NType of the new certificate
    duration        Duration of the certificate's validity (seconds)
    /********************************************************************************************/
    function newCert(address _to, string _certType, string _certName, uint duration) public returns (bytes32) {
        bytes32 certUnique = keccak256(msg.sender, nounce++, _certName);
        // Addidng information
        addOwner(certUnique, _to);
        addOwner(certUnique, msg.sender);

        certs[certUnique].issuer = msg.sender;
        certs[certUnique].certType = _certType;
        certs[certUnique].certName = _certName;
        certs[certUnique].creationDate = now;
        certs[certUnique].expirationDate = certs[certUnique].creationDate + duration;
        certs[certUnique].isStilValid = true;
        
        newCertCreated(certUnique, msg.sender, _certType, _certName, certs[certUnique].creationDate, certs[certUnique].expirationDate);

        return certUnique;
    }

    /********************************************************************************************
    Add new owner to a certificate

    certUnique          Hash of the certificate is gonna check
    newOwner            Address of the new owner to be added
    /********************************************************************************************/
    function addOwner(bytes32 certUnique, address newOwner) public returns (bool success) {
        certs[certUnique].ownerList.push(newOwner);         // Adding owner to the certificate
        users[newOwner].ownCertsList.push(certUnique);      // Adding certificates to the owner list
        certs[certUnique].whiteList.push(newOwner);         // The owner is allowed to check his own certificate
        return true;
    }

    /********************************************************************************************
    Check whether a certificate exist

    certUnique          Address of the certificate is gonna check
    /********************************************************************************************/
    function checkCert(bytes32 certUnique) public view returns (bool success) {
        // Check if certificate exist
        if (isSenderAllowed(certUnique)) {
            return true;
        }
        return false;
    }

    /********************************************************************************************
    Check whether the sender is an owner of the certificate

    certUnique        Address of the certificate is gonna be checked
    /********************************************************************************************/
    function isSenderAnOwner(bytes32 certUnique) public view returns (bool isOwner) {
        for (uint i = 0; i < certs[certUnique].ownerList.length; i++) {
            if (certs[certUnique].ownerList[i] == msg.sender) {
                return(true);
            }
        }
        return (false);
    }

    /********************************************************************************************
    Check whether the sender is allowed to check a certificate existence

    certUnique        Address of the certificate is gonna be checked
    /********************************************************************************************/
    function isSenderAllowed(bytes32 certUnique) public view returns (bool isAllowed) {
        for (uint i = 0; i < certs[certUnique].whiteList.length; i++) {
            if (certs[certUnique].whiteList[i] == msg.sender) {
                return(true);
            }
        }
        return (false);
    }

    /********************************************************************************************
    Check if the certificate is expired

    certUnique        Address of the certificate is gonna be checked
    /********************************************************************************************/
    function checkExpiration(bytes32 certUnique) public returns (bool isValid) {
        if (certs[certUnique].expirationDate < now) {
            certs[certUnique].isStilValid = false;
            return false;
        }
        return true;
    }
    
    /********************************************************************************************
    Add an entity to the whiteList

    certUnique          Address of the certificate is gonna check
    _newEntity          Address of the entity is gonna be added to the list
    /********************************************************************************************/
    function setEntityToWhiteList(bytes32 certUnique, address _newEntity) public returns (bool success) {
        if(isSenderAnOwner(certUnique) || msg.sender == certs[certUnique].issuer) {
            certs[certUnique].whiteList.push(_newEntity);
            return true;
        }
        return false;
    }

    /********************************************************************************************
    Insert a new access log in the history registration

    certUnique          Address of the certificate is gonna regist
    /********************************************************************************************/
    function insertHistory(bytes32 certUnique) public returns (bool success) {
        bytes32 accessLogUnique = keccak256(msg.sender, certUnique);
        accessLogs[accessLogUnique].date = now;
        accessLogs[accessLogUnique].user = msg.sender;
        accessLogs[accessLogUnique].certificate = certUnique;
        for (uint i = 0; i < certs[certUnique].ownerList.length; i++) {
            users[certs[certUnique].ownerList[i]].accessLogList.push(accessLogUnique);
        }
        return true;
    }

    /********************************************************************************************
    Remove an entity from the whiteList

    certUnique          Address of the certificate is gonna check
    entity          Address of the entity is gonna be added to the list
    /********************************************************************************************
    function removeEntityFromWhiteList(bytes32 certUnique, address entity) public returns (bool success) {
        if(msg.sender == certs[certUnique].owner || msg.sender == certs[certUnique].issuer || entity != certs[certUnique].issuer || entity != certs[certUnique].owner) {
            for (uint256 i = 0; i < certs[certUnique].whiteList.length; i++) {
                if (certs[certUnique].whiteList[i] == entity) {                     // Check if entity is in the list
                    for(uint256 j = i; j < certs[certUnique].whiteList.length-1; j++) {     // Remove from the array
                        certs[certUnique].whiteList[j] == certs[certUnique].whiteList[j+1];     //TODO: falla en esta linea
                    }
                    delete certs[certUnique].whiteList[certs[certUnique].whiteList.length-1];
                    return true;
                }
            }
        }
        return false;
    }
    */

    /********************************************************************************************
    Remove a certificate

    certUnique          Address of the certificate is gonna check
    /********************************************************************************************/
    function removeCertificate(bytes32 certUnique) public returns (bool success) {
        if(isSenderAnOwner(certUnique) || msg.sender == certs[certUnique].issuer) {
            certs[certUnique].isStilValid = false;
            return true;
        }
        return false;
    }
}