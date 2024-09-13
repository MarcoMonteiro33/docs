import { Web3 } from "web3";

const web3 = new Web3(
  "https://sepolia.infura.io/v3/hash_projeto"
);

const RECIPIENT_ADDRESS = "0xD947ceFD9e8bEDd53778F016c8677648cdC81341";

const ABI_ERC20 = [
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    type: "function",
  },
];

const USDC_CONTRACT = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const USDT_CONTRACT = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06";

const ERC20_CONTRACT = new web3.eth.Contract(ABI_ERC20, USDT_CONTRACT);

const privateKey =
  "myprivateKey";

const AMOUNT = 2;

async function transferERC20() {
  web3.eth
    .getChainId()
    .then((result) => {
      console.log("Chain ID: " + result);
    })
    .catch((error) => {
      console.error(error);
    });

  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  console.log(account);

  console.log("from: " + account.address);
  console.log("to: " + USDC_CONTRACT);
  console.log("RECIPIENT_ADDRESS: " + RECIPIENT_ADDRESS);
  console.log("AMOUNT: " + AMOUNT);

  const decimals = 6;
  const amountWithDecimals = AMOUNT * Math.pow(10, decimals);

  const data = ERC20_CONTRACT.methods
    .transfer(RECIPIENT_ADDRESS, amountWithDecimals.toString())
    .encodeABI();

  const gasPrice = await web3.eth.getGasPrice();

  const nonce = await web3.eth.getTransactionCount(account.address);
  const chainId = await web3.eth.getChainId();

  const rawTx = {
    from: account.address,
    nonce: nonce,
    to: USDC_CONTRACT,
    data: data,
    chainId: chainId,
  };

  const gasLimit = await web3.eth.estimateGas(rawTx);

  rawTx.gasPrice = gasPrice;
  rawTx.gasLimit = gasLimit;

  const signedTx = await web3.eth.accounts.signTransaction(
    rawTx,
    account.privateKey
  );

  console.log("Transação Assinada.:", signedTx);

  const txReceipt = await web3.eth.sendSignedTransaction(
    signedTx.rawTransaction
  );

  console.log("Transação enviada. Hash:", txReceipt.transactionHash);
}

transferERC20()
  .then(() => {
    console.log("Transação concluída com sucesso.");
  })
  .catch((err) => {
    console.error("Erro ao enviar transação:", err);
  });
