// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Story {
    struct StoryType {
        string title;
        string content;
        string author;
        uint256 timestamp;
    }

    mapping(uint256 => StoryType) public stories;
    uint256 public storyCount;

    constructor() {
        storyCount = 0;
    }

    function createStory(
        string memory _title,
        string memory _content,
        string memory _author
    ) public {
        stories[storyCount] = StoryType(
            _title,
            _content,
            _author,
            block.timestamp
        );
        storyCount++;
    }
}
