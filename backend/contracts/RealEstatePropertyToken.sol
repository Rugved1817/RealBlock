// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RealEstatePropertyToken
 * @dev ERC20 Token representing fractional ownership (1 sqft = 1 token) of a real estate property.
 * Utilizes the "Mint First, Sell Later" model.
 */
contract RealEstatePropertyToken is ERC20, Ownable, Pausable, ReentrancyGuard {
    
    // The price per square foot (1 token) in Wei
    uint256 public pricePerToken;

    // Events
    event TokenPurchase(address indexed buyer, uint256 amount, uint256 totalCost);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    /**
     * @param _name Property/Token Name (e.g., "Skyline Office Complex")
     * @param _symbol Token Symbol (e.g., "SKY-SQFT")
     * @param _totalSqft Total fixed supply (e.g., 10000)
     * @param _initialPricePerToken Price of 1 sqft token in wei
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSqft,
        uint256 _initialPricePerToken
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        require(_totalSqft > 0, "Total property size must be greater than 0");
        require(_initialPricePerToken > 0, "Initial price must be greater than 0");
        
        pricePerToken = _initialPricePerToken;
        
        // Mint the entire supply to the contract owner
        _mint(msg.sender, _totalSqft);
    }

    /**
     * @dev Overrides ERC20 decimals to 0. Every token represents a whole 1 sqft.
     */
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    /**
     * @notice Allows users to purchase tokens directly from the contract owner
     * @param amount The number of tokens (sqft) the user wants to buy
     */
    function buyTokens(uint256 amount) external payable whenNotPaused nonReentrant {
        _handlePurchase(msg.sender, amount, msg.value);
    }

    /**
     * @notice Allows the platform/owner to purchase tokens on behalf of a user
     * @param recipient The address that will receive the tokens
     * @param amount The number of tokens (sqft) to buy
     */
    function buyTokensFor(address recipient, uint256 amount) external payable whenNotPaused nonReentrant {
        _handlePurchase(recipient, amount, msg.value);
    }

    /**
     * @dev Internal function to handle token purchase logic
     */
    function _handlePurchase(address recipient, uint256 amount, uint256 payment) internal {
        require(amount > 0, "Must purchase at least 1 token");
        require(balanceOf(owner()) >= amount, "Not enough tokens available for sale");
        
        uint256 expectedCost = amount * pricePerToken;
        require(payment == expectedCost, "Incorrect payment amount sent");

        // Use internal transfer to move tokens from the owner to the recipient
        _transfer(owner(), recipient, amount);

        emit TokenPurchase(recipient, amount, expectedCost);
    }

    /**
     * @notice Allows the owner to update the sale price of a token
     * @param _newPrice The new price per square foot in wei
     */
    function setPrice(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "Price must be greater than 0");
        uint256 oldPrice = pricePerToken;
        pricePerToken = _newPrice;
        
        emit PriceUpdated(oldPrice, _newPrice);
    }

    /**
     * @notice Allow owner to pause token sales (e.g., during high volatility or legal audits)
     */
    function pauseSale() external onlyOwner {
        _pause();
    }

    /**
     * @notice Allow owner to unpause token sales
     */
    function unpauseSale() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Allows the owner to withdraw collected ETH/MATIC funds
     */
    function withdrawFunds() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available to withdraw");

        // CEI Pattern (Checks-Effects-Interactions)
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(owner(), balance);
    }

    /**
     * @notice Fallback function to reject accidental ETH transfers
     */
    receive() external payable {
        revert("Use buyTokens() to purchase sqft");
    }
}
