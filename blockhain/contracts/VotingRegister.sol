// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
contract VotingRegister is AccessControl {
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    mapping(bytes32 => mapping(uint8 => address)) public elections;
    mapping(bytes32 => uint8) public candidateCount;
    function setVoting(string memory _electionName, uint8 _candidateCount) external onlyRole(DEFAULT_ADMIN_ROLE){ 
        candidateCount[bytes32(bytes(_electionName))] = _candidateCount;
    }
    function addCandidate(string memory _electionName, address[] memory _newCandidates) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint8 count = candidateCount[bytes32(bytes(_electionName))];
        require(count == _newCandidates.length, "Candidate count does not match");
        for (uint8 i = 0; i < count ;i++){
            address candidate = _newCandidates[i];
            elections[bytes32(bytes(_electionName))][i] = candidate;
        }
    }
    function getCandidates(string memory _electionName) external view returns(address[] memory){
        bytes32 electionKey = bytes32(bytes(_electionName)); // Stringi bytes32'ya dönüştür
        address[] memory candidates = new address[](candidateCount[electionKey]);
        for (uint8 i = 0 ; i < candidateCount[electionKey]; i++) 
        {
            candidates[i] = elections[electionKey][i];
        }
        return candidates;
    }
}







