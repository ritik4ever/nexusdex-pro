import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    // Contract addresses (update these after deployment)
    const tradingRouterAddress = process.env.TRADING_ROUTER_ADDRESS || "";
    const portfolioManagerAddress = process.env.PORTFOLIO_MANAGER_ADDRESS || "";
    const priceOracleAddress = process.env.PRICE_ORACLE_ADDRESS || "";

    if (!tradingRouterAddress || !portfolioManagerAddress || !priceOracleAddress) {
        throw new Error("Contract addresses not set in .env file");
    }

    // Get contract instances
    const tradingRouter = await ethers.getContractAt("TradingRouter", tradingRouterAddress);
    const portfolioManager = await ethers.getContractAt("PortfolioManager", portfolioManagerAddress);
    const priceOracle = await ethers.getContractAt("SimplePriceOracle", priceOracleAddress);

    console.log("Setting up contracts...");

    // Authorize PortfolioManager to use TradingRouter
    await tradingRouter.setAuthorizedRouter(portfolioManagerAddress, true);
    console.log("PortfolioManager authorized on TradingRouter");

    // Authorize deployer to update prices
    await priceOracle.setAuthorizedUpdater(deployer.address, true);
    console.log("Deployer authorized as price updater");

    // Set initial token prices (example)
    const tokens = [
        "0x0000000000000000000000000000000000000000", // Native OKB
        "0x5A77f1443D16ee5761d310e38b62f77f726bC71c", // ETH
        "0x1E4a5963aBFD975d8c9021ce480b42188849D41d", // USDT
        "0x74b7F16337b8972027F6196A17a631aC6dE26d22", // USDC
    ];

    const prices = [
        ethers.parseEther("50"),   // OKB: $50
        ethers.parseEther("2500"), // ETH: $2500
        ethers.parseEther("1"),    // USDT: $1
        ethers.parseEther("1"),    // USDC: $1
    ];

    await priceOracle.updatePrices(tokens, prices);
    console.log("Initial token prices set");

    console.log("Contract setup completed!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });