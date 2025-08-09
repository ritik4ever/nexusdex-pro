// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TradingRouter {
    address public owner;
    address public feeRecipient;
    uint256 public feeBps = 30; // 0.3%
    uint256 public constant MAX_FEE_BPS = 100;
    
    mapping(address => bool) public authorizedRouters;
    mapping(address => uint256) public userNonces;
    
    event SwapExecuted(
        address indexed user,
        address indexed fromToken,
        address indexed toToken,
        uint256 fromAmount,
        uint256 toAmount,
        bytes32 txHash  // Removed 'indexed' - only 3 indexed allowed
    );
    
    event FeeCollected(
        address indexed token,
        uint256 amount,
        address indexed feeRecipient
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier nonReentrant() {
        _;
    }
    
    constructor(address _feeRecipient) {
        owner = msg.sender;
        feeRecipient = _feeRecipient;
        authorizedRouters[msg.sender] = true;
    }
    
    function executeSwap(
        address fromToken,
        address toToken,
        uint256 fromAmount,
        uint256 toAmountMin,
        address to,
        uint256 deadline
    ) external nonReentrant returns (uint256) {
        require(fromAmount > 0, "Invalid from amount");
        require(block.timestamp <= deadline, "Transaction expired");
        require(to != address(0), "Invalid recipient");
        
        // Simple demo logic - in production would integrate with DEX aggregators
        uint256 feeAmount = (fromAmount * feeBps) / 10000;
        uint256 receivedAmount = fromAmount - feeAmount;
        
        require(receivedAmount >= toAmountMin, "Insufficient output amount");
        
        userNonces[msg.sender]++;
        
        bytes32 txHash = keccak256(abi.encode(msg.sender, userNonces[msg.sender], block.timestamp));
        
        emit SwapExecuted(
            msg.sender,
            fromToken,
            toToken,
            fromAmount,
            receivedAmount,
            txHash
        );
        
        if (feeAmount > 0) {
            emit FeeCollected(fromToken, feeAmount, feeRecipient);
        }
        
        return receivedAmount;
    }
    
    function setAuthorizedRouter(address router, bool authorized) external onlyOwner {
        authorizedRouters[router] = authorized;
    }
    
    function setFeeBps(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= MAX_FEE_BPS, "Fee too high");
        feeBps = _feeBps;
    }
    
    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "Invalid recipient");
        feeRecipient = _feeRecipient;
    }
    
    function getUserNonce(address user) external view returns (uint256) {
        return userNonces[user];
    }
    
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        // Simple token rescue function
        (bool success, ) = token.call(abi.encodeWithSignature("transfer(address,uint256)", owner, amount));
        require(success, "Transfer failed");
    }
}