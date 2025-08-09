import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying PortfolioManager with the account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    // Get TradingRouter address (should be deployed first)
    const tradingRouterAddress = process.env.TRADING_ROUTER_ADDRESS || "";
    if (!tradingRouterAddress) {
        throw new Error("TRADING_ROUTER_ADDRESS not set in .env");
    }

    // Deploy a simple price oracle first (in production, use Chainlink or similar)
    const PriceOracle = await ethers.getContractFactory("SimplePriceOracle");
    const priceOracle = await PriceOracle.deploy();
    await priceOracle.waitForDeployment();
    console.log("PriceOracle deployed to:", await priceOracle.getAddress());

    // Deploy PortfolioManager
    const PortfolioManager = await ethers.getContractFactory("PortfolioManager");
    const portfolioManager = await PortfolioManager.deploy(
        tradingRouterAddress,
        await priceOracle.getAddress()
    );
    await portfolioManager.waitForDeployment();

    console.log("PortfolioManager deployed to:", await portfolioManager.getAddress());

    // Set initial configurations
    console.log("Setting initial configurations...");

    // Set management fee to 1% (100 basis points)
    await portfolioManager.setManagementFee(100);
    console.log("Management fee set to 1%");

    // Set snapshot interval to 24 hours
    await portfolioManager.setSnapshotInterval(24 * 60 * 60);
    console.log("Snapshot interval set to 24 hours");

    // Verify contracts on block explorer
    if (process.env.XLAYER_API_KEY && process.env.VERIFY_CONTRACTS === "true") {
        console.log("Waiting for block confirmations...");
        await portfolioManager.deploymentTransaction()?.wait(5);

        try {
            await hre.run("verify:verify", {
                address: await portfolioManager.getAddress(),
                constructorArguments: [tradingRouterAddress, await priceOracle.getAddress()],
            });
            console.log("PortfolioManager verified on block explorer");

            await hre.run("verify:verify", {
                address: await priceOracle.getAddress(),
                constructorArguments: [],
            });
            console.log("PriceOracle verified on block explorer");
        } catch (error) {
            console.log("Error verifying contracts:", error);
        }
    }

    // Save deployment addresses
    console.log("\n=== Deployment Summary ===");
    console.log("Network:", await deployer.provider.getNetwork());
    console.log("Deployer:", deployer.address);
    console.log("TradingRouter:", tradingRouterAddress);
    console.log("PriceOracle:", await priceOracle.getAddress());
    console.log("PortfolioManager:", await portfolioManager.getAddress());
    console.log("========================\n");

    // Update .env file with deployed addresses
    console.log("Add these to your .env file:");
    console.log(`PORTFOLIO_MANAGER_ADDRESS=${await portfolioManager.getAddress()}`);
    console.log(`PRICE_ORACLE_ADDRESS=${await priceOracle.getAddress()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });