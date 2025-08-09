import { ethers } from 'ethers'
import Web3 from 'web3'

class Web3Service {
    private providers: Map<number, ethers.JsonRpcProvider>
    private web3Instances: Map<number, Web3>

    constructor() {
        this.providers = new Map()
        this.web3Instances = new Map()
        this.initializeProviders()
    }

    private initializeProviders() {
        const networks = {
            196: process.env.XLAYER_RPC_URL || 'https://rpc.xlayer.tech',
            1: process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
            137: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
        }

        for (const [chainId, rpcUrl] of Object.entries(networks)) {
            const provider = new ethers.JsonRpcProvider(rpcUrl)
            const web3 = new Web3(rpcUrl)

            this.providers.set(Number(chainId), provider)
            this.web3Instances.set(Number(chainId), web3)
        }
    }

    getProvider(chainId: number): ethers.JsonRpcProvider {
        const provider = this.providers.get(chainId)
        if (!provider) {
            throw new Error(`No provider configured for chain ID: ${chainId}`)
        }
        return provider
    }

    getWeb3(chainId: number): Web3 {
        const web3 = this.web3Instances.get(chainId)
        if (!web3) {
            throw new Error(`No Web3 instance configured for chain ID: ${chainId}`)
        }
        return web3
    }

    async getTokenBalance(
        tokenAddress: string,
        walletAddress: string,
        chainId: number
    ): Promise<string> {
        try {
            const provider = this.getProvider(chainId)

            if (tokenAddress === '0x0000000000000000000000000000000000000000') {
                // Native token balance
                const balance = await provider.getBalance(walletAddress)
                return ethers.formatEther(balance)
            } else {
                // ERC20 token balance
                const abi = [
                    'function balanceOf(address owner) view returns (uint256)',
                    'function decimals() view returns (uint8)',
                ]

                const contract = new ethers.Contract(tokenAddress, abi, provider)
                const [balance, decimals] = await Promise.all([
                    contract.balanceOf(walletAddress),
                    contract.decimals(),
                ])

                return ethers.formatUnits(balance, decimals)
            }
        } catch (error) {
            console.error('Error getting token balance:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            throw new Error(`Failed to get token balance: ${errorMessage}`)
        }
    }

    async getTokenInfo(tokenAddress: string, chainId: number) {
        try {
            const provider = this.getProvider(chainId)

            if (tokenAddress === '0x0000000000000000000000000000000000000000') {
                // Native token info
                return {
                    symbol: 'OKB',
                    name: 'OKB Token',
                    decimals: 18,
                }
            }

            const abi = [
                'function symbol() view returns (string)',
                'function name() view returns (string)',
                'function decimals() view returns (uint8)',
            ]

            const contract = new ethers.Contract(tokenAddress, abi, provider)
            const [symbol, name, decimals] = await Promise.all([
                contract.symbol(),
                contract.name(),
                contract.decimals(),
            ])

            return { symbol, name, decimals }
        } catch (error) {
            console.error('Error getting token info:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            throw new Error(`Failed to get token info: ${errorMessage}`)
        }
    }

    async getTransactionHistory(
        walletAddress: string,
        chainId: number,
        limit: number = 50
    ) {
        try {
            const provider = this.getProvider(chainId)

            // Get latest block number
            const latestBlock = await provider.getBlockNumber()
            const fromBlock = Math.max(0, latestBlock - 10000) // Last ~10k blocks

            // This is a simplified version - in production, you'd use indexing services
            const filter = {
                fromBlock,
                toBlock: 'latest',
                topics: [
                    // ERC20 Transfer event signature
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                ],
            }

            const logs = await provider.getLogs(filter)
            return logs.slice(0, limit)
        } catch (error) {
            console.error('Error getting transaction history:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            throw new Error(`Failed to get transaction history: ${errorMessage}`)
        }
    }

    async simulateTransaction(
        to: string,
        data: string,
        value: string,
        from: string,
        chainId: number
    ) {
        try {
            const provider = this.getProvider(chainId)

            const result = await provider.call({
                to,
                data,
                value,
                from,
            })

            return { success: true, result }
        } catch (error) {
            console.error('Transaction simulation failed:', error)
            const errorMessage = error instanceof Error ? error.message : 'Simulation failed'
            return { success: false, error: errorMessage }
        }
    }
}

export default new Web3Service()