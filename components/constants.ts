 import { ethers } from 'ethers'

 const ethBaseURL = "https://api.etherscan.io"
 const ftmBaseURL = "https://api.ftmscan.com"
 const bscBaseURL = "https://api.bscscan.com"
 const plgBaseURL = "https://api.polygonscan.com"

 const gtonETH = "0x01e0E2e61f554eCAaeC0cC933E739Ad90f24a86d"
 const gtonBSC = "0x64D5BaF5ac030e2b7c435aDD967f787ae94D0205"
 const gtonPLG = "0xf480f38c366daac4305dc484b2ad7a496ff00cea"
 const gtonFTM = "0xC1Be9a4D5D45BeeACAE296a7BD5fADBfc14602C4"
 const factoryETHsushi = "0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac"
 const factoryPLGsushi = "0xc35dadb65012ec5796536bd9864ed8773abc74c4"
 const factoryPLGquick = "0x5757371414417b8c6caad45baef941abc7d3ab32"
 const factoryFTMspooky = "0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3"
 const factoryFTMspirit = "0xEF45d134b73241eDa7703fa787148D9C9F4950b0"
 const factoryBSCpancake = "0xca143ce32fe78f1f7019d7d551a6402fc5350c73"
 const balanceKeeperV1 = "0x08D751281654cF6E6951E303eC3c55f92a4B22bd"
 const balanceKeeperV2 = "0x4AB096F49F2Af3cfcf2D851094FA5936f18aed90"
 const voter = "0x23836bcd86D6349FB5f353d80336FaCd74c19a66"
 const balanceAdder = "0x8d712f350A55D65427EfcE56Ec6a36fef28e8Ac9"
 const lpKeeper = "0xA0447eE66E44BF567FF9287107B0c3D2F88efD93"
 const parser = "0x7fCCE1303F7e1fc14780C87F6D67346EC44a4027"

 const topicV2PairCreated = "0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9"
 const topicProcessBalances = "0xdb82536d6a90c757b9cecfe267e7dd17bbb96cb1acd169e21771d6b816ab0bc4"
 const topicTransfer = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
 const topicApprove = "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
 const topicSwapIn = "0x05d0634fe981be85c22e2942a880821b70095d84e152c3ea3c17a4e4250d9d61"
 const topicSwapOut = "0x6b616089d04950dc06c45c6dd787d657980543f89651aec47924752c7d16c888"

const defaultFromFTM =  "4332587" //
const defaultFromPLG = "12295621" //
const defaultFromBSC =  "7000000" // 2021-04-29
const defaultFromETH = "12295621" // 2021-04-23

 const templateProcessBalance = {
     name: "process balance ftm: spirit-GTON/fUSDT",
     form: {
         baseURL: ftmBaseURL,
         fromBlock: defaultFromFTM,
         toBlock: "latest",
         address: balanceAdder,
         topic0: topicProcessBalances,
         isTopic1: false,
         topic1: "",
         isTopic2: true,
         topic2: "0x000000000000000000000000f3245FE3A1EAbB840725B9888347Ce0F01Ded0B4",
         isTopic3: false,
         topic3: "",
         apiKey: "",
         copybuffer: ""
     }
 }

 const templateFTMswapout = {
     name: "unwrap anyswap asset",
     form: {
         baseURL: ftmBaseURL,
         fromBlock: defaultFromFTM,
         toBlock: "latest",
         address: gtonFTM,
         topic0: topicSwapOut,
         isTopic1: false,
         topic1: "",
         isTopic2: false,
         topic2: "",
         isTopic3: false,
         topic3: "",
         apiKey: "",
         copybuffer: ""
     }
 }

 const templateFTMswapin = {
     name: "wrap anyswap asset",
     form: {
         baseURL: ftmBaseURL,
         fromBlock: defaultFromFTM,
         toBlock: "latest",
         address: gtonFTM,
         topic0: topicSwapIn,
         isTopic1: false,
         topic1: "",
         isTopic2: false,
         topic2: "",
         isTopic3: false,
         topic3: "",
         apiKey: "",
         copybuffer: ""
     }
 }

 const templateETHapprove = {
     name: "approve eth",
     form: {
         baseURL: ethBaseURL,
         fromBlock: defaultFromETH,
         toBlock: "latest",
         address: gtonETH,
         topic0: topicApprove,
         isTopic1: false,
         topic1: "",
         isTopic2: false,
         topic2: "",
         isTopic3: false,
         topic3: "",
         apiKey: "",
         copybuffer: ""
     }
 }

 const templateETHtransfer = {
     name: "transfer eth",
     form: {
         baseURL: ethBaseURL,
         fromBlock: defaultFromETH,
         toBlock: "latest",
         address: gtonETH,
         topic0: topicTransfer,
         isTopic1: false,
         topic1: "",
         isTopic2: false,
         topic2: "",
         isTopic3: false,
         topic3: "",
         apiKey: "",
         copybuffer: ""
     }
 }

 const templateETHsushi = {
     name: "sushi eth",
     form: {
         baseURL: ethBaseURL,
         fromBlock: defaultFromETH,
         toBlock: "latest",
         address: factoryETHsushi,
         topic0: topicV2PairCreated,
         isTopic1: true,
         topic1: ethers.utils.hexZeroPad(gtonETH, 32),
         isTopic2: false,
         topic2: "",
         isTopic3: false,
         topic3: "",
         apiKey: "",
         copybuffer: ""
     }
 }

 const templateFTMspirit = {
     name: "spirit ftm",
     form: {
         baseURL: ftmBaseURL,
         fromBlock: defaultFromFTM,
         toBlock: "latest",
         address: factoryFTMspooky,
         topic0: topicV2PairCreated,
         isTopic1: false,
         topic1: "",
         isTopic2: true,
         topic2: ethers.utils.hexZeroPad(gtonFTM, 32),
         isTopic3: false,
         topic3: "",
         apiKey: "",
         copybuffer: ""
     }
 }

 const templateFTMspooky = {
     name: "spooky ftm",
     form: {
         baseURL: ftmBaseURL,
         fromBlock: defaultFromFTM,
         toBlock: "latest",
         address: factoryFTMspooky,
         topic0: topicV2PairCreated,
         isTopic1: false,
         topic1: "",
         isTopic2: true,
         topic2: ethers.utils.hexZeroPad(gtonFTM, 32),
         isTopic3: false,
         topic3: "",
         apiKey: "",
         copybuffer: ""
     }
 }

 const templatePLGquick = {
     name: "quick plg",
     form: {
         baseURL: plgBaseURL,
         fromBlock: defaultFromPLG,
         toBlock: "latest",
         address: factoryPLGquick,
         topic0: topicV2PairCreated,
         isTopic1: false,
         topic1: "",
         isTopic2: true,
         topic2: ethers.utils.hexZeroPad(gtonPLG, 32),
         isTopic3: false,
         topic3: "",
         apiKey: "",
         copybuffer: ""
     }
 }

 const templateBSCpancake = {
     name: "pancake bsc",
     form: {
         baseURL: bscBaseURL,
         fromBlock: defaultFromBSC,
         toBlock: "latest",
         address: factoryETHsushi,
         topic0: topicV2PairCreated,
         isTopic1: false,
         topic1: "",
         isTopic2: true,
         topic2: ethers.utils.hexZeroPad(gtonBSC, 32),
         isTopic3: false,
         topic3: "",
         apiKey: "",
         copybuffer: ""
     }
 }

export const baseURLs = [ethBaseURL, ftmBaseURL, bscBaseURL, plgBaseURL]

export const addresses = [
    {name: "GTON ETH", value: gtonETH},
    {name: "GTON BSC", value: gtonBSC},
    {name: "GTON PLG", value: gtonPLG},
    {name: "GTON FTM", value: gtonFTM},
    {name: "factory ETH sushi", value: factoryETHsushi},
    {name: "factory PLG sushi", value: factoryPLGsushi},
    {name: "factory PLG quick", value: factoryPLGquick},
    {name: "factory FTM spooky", value: factoryFTMspooky},
    {name: "factory FTM spirit", value: factoryFTMspirit},
    {name: "factory BSC pancake", value: factoryBSCpancake},
    {name: "balance keeper V1", value: balanceKeeperV1},
    {name: "balance keeper V2", value: balanceKeeperV2},
    {name: "voter", value: voter},
    {name: "LP keeper", value: lpKeeper},
    {name: "parser", value: parser},
    {name: "balance adder", value: balanceAdder}
]

export const topic0s = [
    {name: "V2 pair created", value: topicV2PairCreated},
    {name: "adder V2 process balances", value: topicProcessBalances},
    {name: "ERC20 transfer", value: topicTransfer},
    {name: "ERC20 approve", value: topicApprove},
    {name: "Anyswap SwapIn", value: topicSwapIn},
    {name: "Anyswap SwapOut", value: topicSwapOut}
]

export const templates = [
    templateETHtransfer,
    templateETHapprove,
    templateFTMswapin,
    templateFTMswapout,
    templateProcessBalance,
    templateETHsushi,
    templatePLGquick,
    templateFTMspooky,
    templateFTMspirit,
    templateBSCpancake,
]
