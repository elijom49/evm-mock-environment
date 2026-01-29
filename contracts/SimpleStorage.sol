// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SimpleStorage
 * @dev A basic contract for testing deployment and interaction
 */
contract SimpleStorage {
    uint256 private storedValue;
    address public owner;

    event ValueChanged(uint256 oldValue, uint256 newValue, address changedBy);

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Store a value
     * @param value The value to store
     */
    function set(uint256 value) public {
        uint256 oldValue = storedValue;
        storedValue = value;
        emit ValueChanged(oldValue, value, msg.sender);
    }

    /**
     * @dev Retrieve the stored value
     * @return The stored value
     */
    function get() public view returns (uint256) {
        return storedValue;
    }
}
