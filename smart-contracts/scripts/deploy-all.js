const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("=== Deploying DeFi Trading Platform Contracts ===");
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)));
    console.log("Network:", (await hre.ethers.provider.getNetwork()).name);
    console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId);

    const feeRecipient = process.env.FEE_RECIPIENT || deployer.address;
    console.log("Fee recipient:", feeRecipient);

    // 1. Deploy TradingRouter
    console.log("\n1. Deploying TradingRouter...");
    const TradingRouter = await hre.ethers.getContractFactory("TradingRouter");
    const tradingRouter = await TradingRouter.deploy(feeRecipient);
    await tradingRouter.waitForDeployment();
    const tradingRouterAddress = await tradingRouter.getAddress();
    console.log("✅ TradingRouter deployed to:", tradingRouterAddress);

    // 2. Deploy SimplePriceOracle
    console.log("\n2. Deploying SimplePriceOracle...");
    const SimplePriceOracle = await hre.ethers.getContractFactory("SimplePriceOracle");
    const priceOracle = await SimplePriceOracle.deploy();
    await priceOracle.waitForDeployment();
    const priceOracleAddress = await priceOracle.getAddress();
    console.log("✅ SimplePriceOracle deployed to:", priceOracleAddress);

    // 3. Deploy PortfolioManager
    console.log("\n3. Deploying PortfolioManager...");
    const PortfolioManager = await hre.ethers.getContractFactory("PortfolioManager");
    const portfolioManager = await PortfolioManager.deploy(
        tradingRouterAddress,
        priceOracleAddress
    );
    await portfolioManager.waitForDeployment();
    const portfolioManagerAddress = await portfolioManager.getAddress();
    console.log("✅ PortfolioManager deployed to:", portfolioManagerAddress);

    // 4. Setup initial configurations
    console.log("\n4. Setting up initial configurations...");

    try {
        // Authorize PortfolioManager on TradingRouter
        const tx1 = await tradingRouter.setAuthorizedRouter(portfolioManagerAddress, true);
        await tx1.wait();
        console.log("✅ PortfolioManager authorized on TradingRouter");

        // Set management fee to 1%
        const tx2 = await portfolioManager.setManagementFee(100);
        await tx2.wait();
        console.log("✅ Management fee set to 1%");

        // Set snapshot interval to 24 hours
        const tx3 = await portfolioManager.setSnapshotInterval(24 * 60 * 60);
        await tx3.wait();
        console.log("✅ Snapshot interval set to 24 hours");

        // Authorize deployer as price updater
        const tx4 = await priceOracle.setAuthorizedUpdater(deployer.address, true);
        await tx4.wait();
        console.log("✅ Deployer authorized as price updater");
    } catch (error) {
        console.log("⚠️ Configuration error:", error.message);
    }

    // 5. Set initial token prices
    console.log("\n5. Setting initial token prices...");
    try {
        const tokens = [
            "0x0000000000000000000000000000000000000000", // Native OKB
            "0x5A77f1443D16ee5761d310e38b62f77f726bC71c", // ETH
            "0x1E4a5963aBFD975d8c9021ce480b42188849D41d", // USDT
            "0x74b7F16337b8972027F6196A17a631aC6dE26d22", // USDC
        ];

        const prices = [
            hre.ethers.parseEther("50"),   // OKB: $50
            hre.ethers.parseEther("2500"), // ETH: $2500
            hre.ethers.parseEther("1"),    // USDT: $1
            hre.ethers.parseEther("1"),    // USDC: $1
        ];

        const tx5 = await priceOracle.updatePrices(tokens, prices);
        await tx5.wait();
        console.log("✅ Initial token prices set");

        // Also update prices in PortfolioManager
        const tx6 = await portfolioManager.updateTokenPrices(tokens, prices);
        await tx6.wait();
        console.log("✅ Token prices updated in PortfolioManager");
    } catch (error) {
        console.log("⚠️ Price setting error:", error.message);
    }

    // 6. Verification (if API key provided)
    if (process.env.VERIFY_CONTRACTS === "true" && process.env.XLAYER_API_KEY) {
        console.log("\n6. Verifying contracts...");
        console.log("Waiting 30 seconds for block confirmations...");
        await new Promise(resolve => setTimeout(resolve, 30000));

        try {
            // Verify TradingRouter
            await hre.run("verify:verify", {
                address: tradingRouterAddress,
                constructorArguments: [feeRecipient],
            });
            console.log("✅ TradingRouter verified");

            // Verify SimplePriceOracle
            await hre.run("verify:verify", {
                address: priceOracleAddress,
                constructorArguments: [],
            });
            console.log("✅ SimplePriceOracle verified");

            // Verify PortfolioManager
            await hre.run("verify:verify", {
                address: portfolioManagerAddress,
                constructorArguments: [tradingRouterAddress, priceOracleAddress],
            });
            console.log("✅ PortfolioManager verified");
        } catch (error) {
            console.log("⚠️ Verification failed:", error.message);
            console.log("You can verify manually later using the contract addresses");
        }
    }

    // 7. Final Summary
    console.log("\n" + "=".repeat(50));
    console.log("🎉 DEPLOYMENT SUCCESSFUL! 🎉");
    console.log("=".repeat(50));
    console.log("Network:", (await hre.ethers.provider.getNetwork()).name);
    console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId);
    console.log("Deployer:", deployer.address);
    console.log("Fee Recipient:", feeRecipient);
    console.log("");
    console.log("📋 Contract Addresses:");
    console.log("TradingRouter:     ", tradingRouterAddress);
    console.log("SimplePriceOracle: ", priceOracleAddress);
    console.log("PortfolioManager:  ", portfolioManagerAddress);
    console.log("");
    console.log("💾 Save these addresses to your .env files:");
    console.log(`TRADING_ROUTER_ADDRESS=${tradingRouterAddress}`);
    console.log(`PRICE_ORACLE_ADDRESS=${priceOracleAddress}`);
    console.log(`PORTFOLIO_MANAGER_ADDRESS=${portfolioManagerAddress}`);
    console.log("");
    console.log("🔗 Blockchain Explorer:");
    console.log(`https://www.oklink.com/xlayer/address/${tradingRouterAddress}`);
    console.log(`https://www.oklink.com/xlayer/address/${portfolioManagerAddress}`);
    console.log("=".repeat(50));
}

main()
    .then(() => {
        console.log("\n✅ Deployment completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });