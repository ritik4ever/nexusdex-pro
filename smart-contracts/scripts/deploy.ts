import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    // Deploy TradingRouter
    const TradingRouter = await ethers.getContractFactory("TradingRouter");
    const feeRecipient = deployer.address; // Use deployer as initial fee recipient

    const tradingRouter = await TradingRouter.deploy(feeRecipient);
    await tradingRouter.waitForDeployment();

    console.log("TradingRouter deployed to:", await tradingRouter.getAddress());

    // Verify contract on block explorer
    if (process.env.XLAYER_API_KEY) {
        console.log("Waiting for block confirmations...");
        await tradingRouter.deploymentTransaction()?.wait(5);

        try {
            await hre.run("verify:verify", {
                address: await tradingRouter.getAddress(),
                constructorArguments: [feeRecipient],
            });
            console.log("Contract verified on block explorer");
        } catch (error) {
            console.log("Error verifying contract:", error);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });