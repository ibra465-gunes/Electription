// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Aday {
    struct Info{
        bytes16 nameAndSurname;
        uint8 age;
        bytes8 gender;
        bytes32 electionName;
        uint16 amountToVote;
        uint32 votingTime;
        bytes32 slogan;
    }
    ERC20 public token;
    address public owner;
    Info _info;
    event TokensReturned(address indexed owner, uint256 amount);

    constructor(address _tokenAddress,
                string memory _nameAndSurname,
                uint8 _age,
                string memory _gender,
                string memory _electionName,
                string memory _slogan)
    {
    require(_tokenAddress != address(0), "Invalid token address");
    token = ERC20(_tokenAddress);
    owner = msg.sender;
    require(bytes(_nameAndSurname).length <= 32, "Name too long");
    require(bytes(_electionName).length <= 32, "Group name too long");
    require(bytes(_slogan).length <= 32, "Slogan too long");
    _info = Info({
        nameAndSurname: bytes16(bytes(_nameAndSurname)),
        age: _age,
        gender: bytes8(bytes(_gender)),
        electionName: bytes32(bytes(_electionName)),
        amountToVote: 0,
        votingTime: uint32(block.timestamp),
        slogan: bytes32(bytes(_slogan))
    });
}
    function voteSupply() public view returns(uint256){
        return token.balanceOf(address(this));
    }
    function getInfo() public view returns (string memory nameAndSurname,
                                            uint8 age,
                                            string memory gender,
                                            string memory electionName,
                                            string memory slogan,
                                            uint256 votingTime,
                                            uint16 amountToVote)
    {
    return (
        string(abi.encodePacked(_info.nameAndSurname)),
        _info.age,
        string(abi.encodePacked(_info.gender)),
        string(abi.encodePacked(_info.electionName)),
        string(abi.encodePacked(_info.slogan)),
        _info.votingTime,
        _info.amountToVote);
}
    bool tokensReturned = false;
    // Seçim sonrası tokenları geri gönderme
    function returnTokens() external {
        require(msg.sender == owner, "Only owner can return tokens");
        require(!tokensReturned, "Tokens already returned");
        tokensReturned = true;
        require(voteSupply() <= type(uint16).max, "Value exceeds uint16 limit");
        uint16 totalVote = uint16(voteSupply());
        _info.amountToVote = totalVote;
        require(token.transfer(owner, totalVote), "Transfer to owner failed");
        emit TokensReturned(owner, totalVote);
    }
}
