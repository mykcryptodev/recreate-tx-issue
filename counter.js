import { ethers } from "ethers";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";

const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"getAddressBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]

export async function setupCallTransaction(element) {
  element.innerHTML = `test`;

  const doTx = async () => {
    const sdk = new CoinbaseWalletSDK({
      appName: "App Name",
      appChainIds: [84532],
    });

    const provider = await sdk.makeWeb3Provider({ options: "all" });

    // Get accounts / connect
    const accounts = await provider.request({ method: "eth_requestAccounts" });

    // Get a BrowserProvider by using ethers to wrap the Coinbase provider
    // Note: Don't need to do this for the MetaMask provider
    // But if I don't do it here for Coinbase provider it says that .getSigner is undefined when trying to get a signer
    const browserProvider = new ethers.BrowserProvider(provider);

    // Get a signer for the contract transaction
    const signer = await browserProvider.getSigner();

    // Instantiate contract
    const contract = new ethers.Contract(
      "0x857f5c31265f756e89ee64e94D536eFC7d6BEb38",
      abi,
      signer
    );

    const ethSpendAmount = BigInt(ethers.parseEther("0.0000001").toString());

    // Call the contract function and send ETH with it
    const tx = await contract.deposit({
      value: ethSpendAmount,
    });
    console.log({ tx })

  };
  element.addEventListener("click", () => doTx());
}
export function setupCounter(element) {
  let counter = 0;
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener("click", () => setCounter(counter + 1));
  setCounter(0);
}
