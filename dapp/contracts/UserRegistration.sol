// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract UserRegistration {
    struct User {
        string username;
        bool isRegistered;
    }

    // Mapping from wallet address to user details
    mapping(address => User) private users;

    // Event for user registration
    event UserRegistered(address indexed user, string username);

    // Function to register a user
    function register(string calldata _username) external {
        require(!users[msg.sender].isRegistered, "User already registered");

        // Store user details
        users[msg.sender] = User({
            username: _username,
            isRegistered: true
        });

        emit UserRegistered(msg.sender, _username);
    }

    // Function to get user details
    function getUser(address _user) external view returns (string memory username, bool isRegistered) {
        require(users[_user].isRegistered, "User not registered");
        User memory user = users[_user];
        return (user.username, user.isRegistered);
    }
}
