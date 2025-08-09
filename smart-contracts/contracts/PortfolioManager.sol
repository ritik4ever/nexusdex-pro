// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PortfolioManager {
    address public owner;
    address public tradingRouter;
    address public priceOracle;
    
    struct TokenHolding {
        uint256 amount;
        uint256 valueUSD;
        uint256 lastTradeTimestamp;
    }
    
    struct Portfolio {
        uint256 totalValueUSD;
        uint256 lastUpdated;
        bool isActive;
        address[] tokens;
        mapping(address => TokenHolding) holdings;
        mapping(address => uint256) tokenIndex; // Track token position in array
    }
    
    mapping(address => Portfolio) public portfolios;
    mapping(address => uint256) public tokenPricesUSD;
    mapping(address => bool) public authorizedPriceOracles;
    
    uint256 public managementFee = 100; // 1% in basis points
    uint256 public snapshotInterval = 24 hours;
    uint256 public constant MAX_TOKENS_PER_PORTFOLIO = 50;
    
    event PortfolioCreated(address indexed user, uint256 timestamp);
    event TokenAdded(address indexed user, address indexed token, uint256 amount);
    event TokenRemoved(address indexed user, address indexed token, uint256 amount);
    event PriceUpdated(address indexed token, uint256 price, uint256 timestamp);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyAuthorizedOracle() {
        require(authorizedPriceOracles[msg.sender] || msg.sender == owner, "Unauthorized oracle");
        _;
    }
    
    modifier portfolioExists(address user) {
        require(portfolios[user].isActive, "Portfolio does not exist");
        _;
    }
    
    constructor(address _tradingRouter, address _priceOracle) {
        owner = msg.sender;
        tradingRouter = _tradingRouter;
        priceOracle = _priceOracle;
        authorizedPriceOracles[_priceOracle] = true;
    }
    
    function createPortfolio() external {
        require(!portfolios[msg.sender].isActive, "Portfolio already exists");
        
        Portfolio storage portfolio = portfolios[msg.sender];
        portfolio.isActive = true;
        portfolio.lastUpdated = block.timestamp;
        portfolio.totalValueUSD = 0;
        
        emit PortfolioCreated(msg.sender, block.timestamp);
    }
    
    function addTokenToPortfolio(address token, uint256 amount) external portfolioExists(msg.sender) {
        require(token != address(0), "Invalid token");
        require(amount > 0, "Amount must be greater than 0");
        
        Portfolio storage portfolio = portfolios[msg.sender];
        require(portfolio.tokens.length < MAX_TOKENS_PER_PORTFOLIO, "Portfolio full");
        
        // Add token to array if not already present
        if (portfolio.holdings[token].amount == 0) {
            portfolio.tokens.push(token);
            portfolio.tokenIndex[token] = portfolio.tokens.length - 1;
        }
        
        // Update holding
        TokenHolding storage holding = portfolio.holdings[token];
        holding.amount += amount;
        holding.lastTradeTimestamp = block.timestamp;
        
        // Update value if price is available
        if (tokenPricesUSD[token] > 0) {
            holding.valueUSD = (holding.amount * tokenPricesUSD[token]) / 1e18;
        }
        
        portfolio.lastUpdated = block.timestamp;
        
        emit TokenAdded(msg.sender, token, amount);
    }
    
    function removeTokenFromPortfolio(address token, uint256 amount) external portfolioExists(msg.sender) {
        Portfolio storage portfolio = portfolios[msg.sender];
        TokenHolding storage holding = portfolio.holdings[token];
        
        require(holding.amount >= amount, "Insufficient token balance");
        
        holding.amount -= amount;
        holding.lastTradeTimestamp = block.timestamp;
        
        // Update value if price is available
        if (tokenPricesUSD[token] > 0) {
            holding.valueUSD = (holding.amount * tokenPricesUSD[token]) / 1e18;
        }
        
        // Remove token from array if no amount left
        if (holding.amount == 0) {
            uint256 tokenIdx = portfolio.tokenIndex[token];
            uint256 lastIdx = portfolio.tokens.length - 1;
            
            if (tokenIdx != lastIdx) {
                portfolio.tokens[tokenIdx] = portfolio.tokens[lastIdx];
                portfolio.tokenIndex[portfolio.tokens[tokenIdx]] = tokenIdx;
            }
            
            portfolio.tokens.pop();
            delete portfolio.tokenIndex[token];
            delete portfolio.holdings[token];
        }
        
        portfolio.lastUpdated = block.timestamp;
        
        emit TokenRemoved(msg.sender, token, amount);
    }
    
    function getPortfolioValue(address user) public view returns (uint256) {
        Portfolio storage portfolio = portfolios[user];
        if (!portfolio.isActive) return 0;
        
        uint256 totalValue = 0;
        for (uint256 i = 0; i < portfolio.tokens.length; i++) {
            address token = portfolio.tokens[i];
            TokenHolding storage holding = portfolio.holdings[token];
            uint256 currentPrice = tokenPricesUSD[token];
            if (currentPrice > 0) {
                totalValue += (holding.amount * currentPrice) / 1e18;
            }
        }
        
        return totalValue;
    }
    
    function getPortfolioTokens(address user) external view returns (address[] memory) {
        return portfolios[user].tokens;
    }
    
    function getTokenHolding(address user, address token) external view returns (TokenHolding memory) {
        return portfolios[user].holdings[token];
    }
    
    function getPortfolioSummary(address user) external view returns (
        uint256 totalValue,
        uint256 tokenCount,
        uint256 lastUpdated
    ) {
        Portfolio storage portfolio = portfolios[user];
        return (
            getPortfolioValue(user),
            portfolio.tokens.length,
            portfolio.lastUpdated
        );
    }
    
    function updateTokenPrice(address token, uint256 priceUSD) external onlyAuthorizedOracle {
        require(token != address(0), "Invalid token");
        require(priceUSD > 0, "Invalid price");
        
        tokenPricesUSD[token] = priceUSD;
        emit PriceUpdated(token, priceUSD, block.timestamp);
    }
    
    function updateTokenPrices(
        address[] calldata tokens,
        uint256[] calldata prices
    ) external onlyAuthorizedOracle {
        require(tokens.length == prices.length, "Array length mismatch");
        
        for (uint256 i = 0; i < tokens.length; i++) {
            require(tokens[i] != address(0), "Invalid token");
            require(prices[i] > 0, "Invalid price");
            
            tokenPricesUSD[tokens[i]] = prices[i];
            emit PriceUpdated(tokens[i], prices[i], block.timestamp);
        }
    }
    
    function getTokenPrice(address token) public view returns (uint256) {
        return tokenPricesUSD[token];
    }
    
    function setAuthorizedOracle(address oracle, bool authorized) external onlyOwner {
        authorizedPriceOracles[oracle] = authorized;
    }
    
    function setManagementFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee too high"); // Max 10%
        managementFee = _fee;
    }
    
    function setSnapshotInterval(uint256 _interval) external onlyOwner {
        require(_interval >= 1 hours, "Interval too short");
        snapshotInterval = _interval;
    }
    
    function setTradingRouter(address _tradingRouter) external onlyOwner {
        tradingRouter = _tradingRouter;
    }
}