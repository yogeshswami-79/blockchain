// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Storage {
    struct Profile {
        string  name;
        uint256 age;
        bool    active;
    }

    mapping(address => Profile) private profiles;

    event ProfileUpdated(address indexed user, string name);

    function setProfile(string calldata name, uint256 age) external {
        profiles[msg.sender] = Profile({ name: name, age: age, active: true });
        emit ProfileUpdated(msg.sender, name);
    }

    function getProfile(address user)
        external view returns (string memory, uint256, bool)
    {
        Profile storage p = profiles[user];
        return (p.name, p.age, p.active);
    }
}
