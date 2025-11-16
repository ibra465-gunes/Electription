// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VoteToken is ERC20, AccessControl {
    mapping(bytes32 => uint32) private votingDuration;  
    mapping(bytes32 => mapping(address => bool)) public voted;
    mapping(bytes32 => mapping(address => bool)) public approveElection;
    address admin;

    constructor(uint16 voterCount) ERC20("Vote", "VT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        admin = msg.sender;
        _mint(msg.sender, voterCount);
    }

    function setDurationTime(string memory electionName, uint32 time) external onlyRole(DEFAULT_ADMIN_ROLE) {
        votingDuration[bytes32(bytes(electionName))] = clock() + time;
    }
    function getDurationTime(string memory electionName) external view returns(uint32) {
        return votingDuration[bytes32(bytes(electionName))];
    }
    function getNotFinishElection(string[] memory electionNames) external view returns (string[] memory) {
        uint count = 0;

        for (uint i = 0; i < electionNames.length; i++) {
            bytes32 electionKey = bytes32(bytes(electionNames[i]));
            if (votingDuration[electionKey] > block.timestamp) {
                count++;
            }
        }

        string[] memory notFinishedElections = new string[](count);
        uint index = 0;

        for (uint i = 0; i < electionNames.length; i++) {
            bytes32 electionKey = bytes32(bytes(electionNames[i]));
            if (votingDuration[electionKey] > block.timestamp) {
                notFinishedElections[index] = electionNames[i];
                index++;
            }
        }

        return notFinishedElections;
    }

    function approveVote(address[] memory voters, string memory electionName) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(voters.length > 0, "No voters provided");

        for (uint16 i = 0; i < voters.length; i++) {
            voted[bytes32(bytes(electionName))][voters[i]] = false;
            approveElection[bytes32(bytes(electionName))][voters[i]] = true;

            uint8 permission = uint8(allowance(admin, voters[i]));
            if (permission >= 1) {
                _approve(admin, voters[i], permission + 1);
            } else {
                _approve(admin, voters[i], 1);
            }
        }
    }

    function revokePermission(address[] memory voters, string memory electionName) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(voters.length > 0, "No voters provided");
        require(clock() > votingDuration[bytes32(bytes(electionName))], "The election is ongoing");

        for (uint16 i = 0; i < voters.length; i++) {
            if (!voted[bytes32(bytes(electionName))][voters[i]]) {
                approveElection[bytes32(bytes(electionName))][voters[i]] = false;

                uint8 permission = uint8(allowance(admin, voters[i]));
                if (permission > 1) {
                    _approve(admin, voters[i], permission - 1);
                } else {
                    _approve(admin, voters[i], 0);
                }
            }
        }
    }

    function voting(address aday, string memory electionName) external {
        require(allowance(admin, msg.sender) >= 1, "You are not allowed to vote");
        require(approveElection[bytes32(bytes(electionName))][msg.sender], "You are not allowed to this election");
        require(clock() < votingDuration[bytes32(bytes(electionName))], "Voting period has ended");
        require(!voted[bytes32(bytes(electionName))][msg.sender], "You have already voted in this election");

        if (balanceOf(admin) < 1) {
            mint();
        }

        transferFrom(admin, aday, 1);
        voted[bytes32(bytes(electionName))][msg.sender] = true;
    }

    function mint() internal {
        _mint(admin, 1);
    }

    function clock() public view returns (uint32) {
        return uint32(block.timestamp);
    }
}

