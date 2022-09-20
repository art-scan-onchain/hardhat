//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ArtThenticator is Ownable {
    struct Art {
        uint256 id;
        string uuid;
        string name;
        string medium;
        string coa;
        uint256 date;
    }

    address public operator;
    uint256 private nextId = 1;
    mapping(string => Art) private collection;
    mapping(uint256 => string) private idMap;
    // mapping(uint256 => string) private uuidMap;

    constructor() {
        // initial operator is the contract creator
        operator = msg.sender;
    }

    modifier onlyOperator() {
        require(msg.sender == operator, 'Should be operator');
        _;
    }

    // Public View: You must know the UUID of the Art first
    // This can be called by verifiers
    function getIdByUUID(string memory uuid) public view returns (Art memory) {
        return collection[uuid];
    }

    // onlyOwner
    function setOperator(address _opereator) public onlyOwner {
        operator = _opereator;
    }

    function addArt(string memory uuid, string memory name, string memory medium, string memory coa, uint256 date) public onlyOperator {
        Art memory newArt = Art(nextId, uuid, name, medium, coa, date);
        collection[uuid] = newArt;
        idMap[nextId] = uuid;
        nextId++;
    }

    // modify art will create a newArt but on the same id
    function modifyArt(uint256 id, string memory uuid, string memory name, string memory medium, string memory coa, uint256 date) public onlyOperator {
        require(id < nextId, "ID does not exist");

        collection[idMap[id]].id = 0;

        Art memory modifiedArt = Art(id, uuid, name, medium, coa, date);

        collection[uuid] = modifiedArt;
        idMap[id] = uuid;
    }

    function getNextId() public view onlyOperator returns(uint256) {
        return nextId;
    }

    function getById(uint256 id) public view returns (Art memory) {
        return collection[idMap[id]];
    }

}