import { ethers } from "hardhat";

async function main(): Promise<void> {
    console.log("🚀 Deploy and Test Complete Flow");
    console.log("=================================");

    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);
    console.log("Network:", (await ethers.provider.getNetwork()).name);

    // 1. Deploy contracts
    console.log("\n1️⃣ Deploying contracts...");

    const TradingRouter = await ethers.getContractFactory("TradingRouter");
    const tradingRouter = await TradingRouter.deploy(deployer.address);
    await tradingRouter.waitForDeployment();
    const tradingRouterAddress = await tradingRouter.getAddress();
    console.log("✅ TradingRouter deployed:", tradingRouterAddress);

    const SimplePriceOracle = await ethers.getContractFactory("SimplePriceOracle");
    const priceOracle = await SimplePriceOracle.deploy();
    await priceOracle.waitForDeployment();
    const priceOracleAddress = await priceOracle.getAddress();
    console.log("✅ SimplePriceOracle deployed:", priceOracleAddress);

    const PortfolioManager = await ethers.getContractFactory("PortfolioManager");
    const portfolioManager = await PortfolioManager.deploy(tradingRouterAddress, priceOracleAddress);
    await portfolioManager.waitForDeployment();
    const portfolioManagerAddress = await portfolioManager.getAddress();
    console.log("✅ PortfolioManager deployed:", portfolioManagerAddress);

    // 2. Setup
    console.log("\n2️⃣ Setting up contracts...");

    await tradingRouter.setAuthorizedRouter(portfolioManagerAddress, true);
    console.log("✅ PortfolioManager authorized");

    await portfolioManager.setManagementFee(100);
    console.log("✅ Management fee set to 1%");

    // 3. Test functionality
    console.log("\n3️⃣ Testing functionality...");

    // Test price setting
    const tokens = [
        "0x1111111111111111111111111111111111111111",
        "0x2222222222222222222222222222222222222222",
    ];
    const prices = [
        ethers.parseEther("50"),
        ethers.parseEther("2500"),
    ];

    await priceOracle.updatePrices(tokens, prices);
    await portfolioManager.updateTokenPrices(tokens, prices);
    console.log("✅ Token prices set");

    // Test portfolio creation
    await portfolioManager.createPortfolio();
    console.log("✅ Portfolio created");

    // 4. Summary
    console.log("\n🎉 Deployment and Testing Complete!");
    console.log("=====================================");
    console.log("Contract Addresses:");
    console.log("TradingRouter:    ", tradingRouterAddress);
    console.log("SimplePriceOracle:", priceOracleAddress);
    console.log("PortfolioManager: ", portfolioManagerAddress);

    console.log("\nAdd to .env:");
    console.log(`TRADING_ROUTER_ADDRESS=${tradingRouterAddress}`);
    console.log(`PRICE_ORACLE_ADDRESS=${priceOracleAddress}`);
    console.log(`PORTFOLIO_MANAGER_ADDRESS=${portfolioManagerAddress}`);
}

main().catch(console.error);