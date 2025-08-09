import { ethers } from "hardhat";

async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();
  
  console.log("=== Deploying DeFi Trading Platform Contracts ===");
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);

  const feeRecipient = process.env.FEE_RECIPIENT || deployer.address;
  console.log("Fee recipient:", feeRecipient);

  // 1. Deploy TradingRouter
  console.log("\n1. Deploying TradingRouter...");
  const TradingRouter = await ethers.getContractFactory("TradingRouter");
  const tradingRouter = await TradingRouter.deploy(feeRecipient);
  await tradingRouter.waitForDeployment();
  const tradingRouterAddress = await tradingRouter.getAddress();
  console.log("✅ TradingRouter deployed to:", tradingRouterAddress);

  // 2. Deploy SimplePriceOracle
  console.log("\n2. Deploying SimplePriceOracle...");
  const SimplePriceOracle = await ethers.getContractFactory("SimplePriceOracle");
  const priceOracle = await SimplePriceOracle.deploy();
  await priceOracle.waitForDeployment();
  const priceOracleAddress = await priceOracle.getAddress();
  console.log("✅ SimplePriceOracle deployed to:", priceOracleAddress);

  // 3. Deploy PortfolioManager
  console.log("\n3. Deploying PortfolioManager...");
  const PortfolioManager = await ethers.getContractFactory("PortfolioManager");
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
  } catch (error: any) {
    console.log("⚠️ Configuration error:", error.message);
  }

  // 5. Set initial token prices
  console.log("\n5. Setting initial token prices...");
  try {
    const tokens = [
      "0x1111111111111111111111111111111111111111", // Mock OKB
      "0x2222222222222222222222222222222222222222", // Mock ETH
      "0x3333333333333333333333333333333333333333", // Mock USDT
      "0x4444444444444444444444444444444444444444", // Mock USDC
    ];

    const prices = [
      ethers.parseEther("50"),   // OKB: $50
      ethers.parseEther("2500"), // ETH: $2500
      ethers.parseEther("1"),    // USDT: $1
      ethers.parseEther("1"),    // USDC: $1
    ];

    const tx5 = await priceOracle.updatePrices(tokens, prices);
    await tx5.wait();
    console.log("✅ Initial token prices set");

    // Also update prices in PortfolioManager
    const tx6 = await portfolioManager.updateTokenPrices(tokens, prices);
    await tx6.wait();
    console.log("✅ Token prices updated in PortfolioManager");
  } catch (error: any) {
    console.log("⚠️ Price setting error:", error.message);
  }

  // 6. Final Summary
  console.log("\n" + "=".repeat(50));
  console.log("🎉 DEPLOYMENT SUCCESSFUL! 🎉");
  console.log("=".repeat(50));
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
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
  console.log("🔗 Frontend .env.local:");
  console.log(`NEXT_PUBLIC_TRADING_ROUTER_ADDRESS=${tradingRouterAddress}`);
  console.log(`NEXT_PUBLIC_PORTFOLIO_MANAGER_ADDRESS=${portfolioManagerAddress}`);
  console.log(`NEXT_PUBLIC_PRICE_ORACLE_ADDRESS=${priceOracleAddress}`);
  console.log("=".repeat(50));
}

main()
  .then(() => {
    console.log("\n✅ Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error: Error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
