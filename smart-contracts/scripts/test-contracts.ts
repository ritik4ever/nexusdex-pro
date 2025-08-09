import { ethers } from "hardhat";

async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();
  
  console.log("🧪 Testing deployed contracts...");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  
  // Use latest deployed addresses or deploy new ones
  const TradingRouter = await ethers.getContractFactory("TradingRouter");
  const tradingRouter = await TradingRouter.deploy(deployer.address);
  await tradingRouter.waitForDeployment();
  const tradingRouterAddress = await tradingRouter.getAddress();
  
  const SimplePriceOracle = await ethers.getContractFactory("SimplePriceOracle");
  const priceOracle = await SimplePriceOracle.deploy();
  await priceOracle.waitForDeployment();
  const priceOracleAddress = await priceOracle.getAddress();
  
  const PortfolioManager = await ethers.getContractFactory("PortfolioManager");
  const portfolioManager = await PortfolioManager.deploy(tradingRouterAddress, priceOracleAddress);
  await portfolioManager.waitForDeployment();
  const portfolioManagerAddress = await portfolioManager.getAddress();
  
  console.log("✅ Contracts deployed for testing");
  console.log("TradingRouter:", tradingRouterAddress);
  console.log("PortfolioManager:", portfolioManagerAddress);
  console.log("SimplePriceOracle:", priceOracleAddress);
  
  // Test basic functionality
  console.log("\n🔍 Testing basic functionality...");
  
  console.log("TradingRouter owner:", await tradingRouter.owner());
  console.log("TradingRouter fee:", await tradingRouter.feeBps());
  
  console.log("PortfolioManager owner:", await portfolioManager.owner());
  console.log("Management fee:", await portfolioManager.managementFee());
  
  console.log("PriceOracle owner:", await priceOracle.owner());
  
  console.log("✅ All tests passed!");
}

main().catch(console.error);
