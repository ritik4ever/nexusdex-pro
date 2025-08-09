import { ethers } from "hardhat";

async function main(): Promise<void> {
    const priceOracleAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const portfolioManagerAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    console.log("Fixing token prices...");

    const priceOracle = await ethers.getContractAt("SimplePriceOracle", priceOracleAddress);
    const portfolioManager = await ethers.getContractAt("PortfolioManager", portfolioManagerAddress);

    // Use actual token addresses (these are example addresses)
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

    try {
        // Update in price oracle
        const tx1 = await priceOracle.updatePrices(tokens, prices);
        await tx1.wait();
        console.log("✅ Prices updated in PriceOracle");

        // Update in portfolio manager
        const tx2 = await portfolioManager.updateTokenPrices(tokens, prices);
        await tx2.wait();
        console.log("✅ Prices updated in PortfolioManager");

        // Verify prices
        console.log("\n📊 Current Prices:");
        for (let i = 0; i < tokens.length; i++) {
            const price = await priceOracle.tokenPrices(tokens[i]);
            console.log(`Token ${tokens[i]}: $${ethers.formatEther(price)}`);
        }
    } catch (error: any) {
        console.error("Error:", error.message);
    }
}

main().catch(console.error);