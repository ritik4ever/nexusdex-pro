// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimplePriceOracle {
    address public owner;
    mapping(address => uint256) public tokenPrices;
    mapping(address => uint256) public lastUpdated;
    mapping(address => bool) public authorizedUpdaters;
    
    uint256 public constant PRICE_DECIMALS = 18;
    uint256 public maxPriceAge = 3600; // 1 hour
    
    event PriceUpdated(address indexed token, uint256 price, uint256 timestamp);
    event UpdaterAuthorized(address indexed updater, bool authorized);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyAuthorizedUpdater() {
        require(authorizedUpdaters[msg.sender] || msg.sender == owner, "Unauthorized");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        authorizedUpdaters[msg.sender] = true;
    }
    
    function updatePrice(address token, uint256 price) external onlyAuthorizedUpdater {
        require(token != address(0), "Invalid token");
        require(price > 0, "Invalid price");
        
        tokenPrices[token] = price;
        lastUpdated[token] = block.timestamp;
        
        emit PriceUpdated(token, price, block.timestamp);
    }
    
    function updatePrices(
        address[] calldata tokens,
        uint256[] calldata prices
    ) external onlyAuthorizedUpdater {
        require(tokens.length == prices.length, "Array length mismatch");
        
        for (uint256 i = 0; i < tokens.length; i++) {
            require(tokens[i] != address(0), "Invalid token");
            require(prices[i] > 0, "Invalid price");
            
            tokenPrices[tokens[i]] = prices[i];
            lastUpdated[tokens[i]] = block.timestamp;
            
            emit PriceUpdated(tokens[i], prices[i], block.timestamp);
        }
    }
    
    function getPrice(address token) external view returns (uint256) {
        require(tokenPrices[token] > 0, "Price not available");
        require(
            block.timestamp - lastUpdated[token] <= maxPriceAge,
            "Price too old"
        );
        
        return tokenPrices[token];
    }
    
    function getPriceAge(address token) external view returns (uint256) {
        return block.timestamp - lastUpdated[token];
    }
    
    function setAuthorizedUpdater(address updater, bool authorized) external onlyOwner {
        authorizedUpdaters[updater] = authorized;
        emit UpdaterAuthorized(updater, authorized);
    }
    
    function setMaxPriceAge(uint256 _maxPriceAge) external onlyOwner {
        require(_maxPriceAge >= 300, "Age too short");
        maxPriceAge = _maxPriceAge;
    }
}