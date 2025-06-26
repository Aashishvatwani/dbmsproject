// contracts/DocumentStore.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentStore {
    struct Document {
        string fileName;
        string ipfsHash;
        uint timestamp;
    }

    mapping(address => Document[]) private docs;

    function storeDocument(string memory _fileName, string memory _ipfsHash) public {
        docs[msg.sender].push(Document(_fileName, _ipfsHash, block.timestamp));
    }

    function getDocuments() public view returns (Document[] memory) {
        return docs[msg.sender];
    }
}
