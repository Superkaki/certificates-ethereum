contract CertificatesAPI{
    /*
    Contract for interfacing with the certificate's contract
    */
    function getMyAddress() constant public returns (address);
    function setEntity(address add, bytes32 entityName) public;
    function setUser(address add, bytes32 userName, bytes32 userNid) public;
    function getEntityByAddress(address add) constant public returns (bytes32);
    function getUserByAddress(address add) constant public returns (bytes32, bytes32);
    function newCert(address _to, bytes32 _certName) public returns (uint256 id);
    function checkCert(uint256 unique) public view returns (bool success);
    function setEntityToWhiteList(uint256 unique, address _newEntity) public returns (bool success);
    function removeCertificate(uint256 unique) public returns (bool success);

}