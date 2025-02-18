// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract StoryToken is ERC20, Ownable {
    using Math for uint256;

    // Tokenomics
    uint256 public constant PRESALE_PRICE = 10; // 10 STORY per 1 POL (1 ETH)
    uint256 public constant POL_UNIT = 1 ether;
    uint256 public constant BURN_RATE = 2; // 2% burn per transaction
    uint256 public presaleEndTime;
    uint256 public totalSupplyCap = 1_000_000 * 10 ** 18; // Max token supply

    bool public presaleActive = true;

    event TokensPurchased(
        address indexed buyer,
        uint256 amount,
        uint256 polSpent
    );
    event TokensSold(
        address indexed seller,
        uint256 amount,
        uint256 polReceived
    );

    constructor(
        uint256 _presaleDuration,
        address initialOwner
    ) ERC20("StoryToken", "$STORY") Ownable(initialOwner) {
        _mint(address(this), totalSupplyCap); // Mint total supply to contract
        presaleEndTime = block.timestamp + _presaleDuration;
    }

    modifier onlyDuringPresale() {
        require(presaleActive, "Presale has ended");
        require(block.timestamp <= presaleEndTime, "Presale is over");
        _;
    }

    modifier onlyAfterPresale() {
        require(
            !presaleActive || block.timestamp > presaleEndTime,
            "Presale is ongoing"
        );
        _;
    }

    function buyPresaleTokens() external payable onlyDuringPresale {
        uint256 storyAmount = (msg.value * PRESALE_PRICE) / POL_UNIT;
        require(
            balanceOf(address(this)) >= storyAmount,
            "Not enough STORY tokens"
        );
        _transfer(address(this), msg.sender, storyAmount);
        emit TokensPurchased(msg.sender, storyAmount, msg.value);
    }

    function endPresale() external onlyOwner {
        presaleActive = false;
    }

    function bondingCurvePrice(
        uint256 tokenAmount
    ) public view onlyAfterPresale returns (uint256) {
        require(tokenAmount > 0, "Token amount must be greater than zero");

        // Base price in POL (1 POL = 1 ETH) scaled by logarithmic growth
        uint256 basePrice = 1 ether; // Adjusted for 1 POL = 1 ETH
        uint256 scaleFactor = 10; // Adjust scaling to fine-tune curve steepness

        // Logarithmic curve: price = basePrice * log(tokenAmount + 1) * scaleFactor
        uint256 logValue = Math.log10(tokenAmount + 1);
        return basePrice * logValue * scaleFactor;
    }

    function buyTokens(uint256 tokenAmount) external payable onlyAfterPresale {
        uint256 polRequired = bondingCurvePrice(tokenAmount);
        require(msg.value >= polRequired, "Insufficient POL sent");
        require(
            balanceOf(address(this)) >= tokenAmount,
            "Not enough STORY tokens"
        );

        _transfer(address(this), msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, tokenAmount, msg.value);
    }

    function sellTokens(uint256 tokenAmount) external onlyAfterPresale {
        require(
            balanceOf(msg.sender) >= tokenAmount,
            "Insufficient token balance"
        );

        uint256 polAmount = bondingCurvePrice(tokenAmount);
        require(
            address(this).balance >= polAmount,
            "Not enough POL in contract"
        );

        _transfer(msg.sender, address(this), tokenAmount);
        payable(msg.sender).transfer(polAmount);

        emit TokensSold(msg.sender, tokenAmount, polAmount);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal override {
        uint256 burnAmount = (amount * BURN_RATE) / 100;
        uint256 sendAmount = amount - burnAmount;
        super._transfer(sender, recipient, sendAmount);
        _burn(sender, burnAmount);
    }
}
