<template>
<div style="font-family: monospace; height: 40vh">
    <input style="width: 200px" v-model="ftmAddress" placeholder="ftm token address">
    <input style="width: 200px" v-model="ftmApiKey" placeholder="ftm API key">
    <br>
    <input style="width: 200px" v-model="ethAddress" placeholder="eth token address">
    <input style="width: 200px" v-model="ethApiKey" placeholder="eth API key">
    <input style="width: 200px" v-model="ethRPCKey" placeholder="eth infura key">
    <br>
    <input style="width: 200px" v-model="plgAddress" placeholder="plg token address">
    <input style="width: 200px" v-model="plgApiKey" placeholder="plg API key">
    <br>
    <input style="width: 200px" v-model="bscAddress" placeholder="bsc token address">
    <input style="width: 200px" v-model="bscApiKey" placeholder="bsc API key">
    <br>
    <Button @click="update">Update</Button>
    <p>events: {{ events.length }}</p>
    <div style="overflow: scroll; height: 70vh;">
        <div v-for="pool in pools" :key="pool.address">
            <div style="background-color: black; height: 10px"></div>
            <p>chain: {{ pool.chain }}</p>
            <p>dex: {{ pool.dex }}</p>
            <p>factory: {{ pool.factory }}</p>
            <p>address: {{ pool.address }}</p>
            <p>created: {{ pool.createdTimestamp }} ({{ pool.createdDate }})</p>
            <p>created tx: {{ pool.createdTransactionHash }}</p>
            <p>token0: {{ pool.token0.name }} {{ pool.token0.address }} ({{ pool.token0.reserve }})</p>
            <p>token1: {{ pool.token1.name }} {{ pool.token1.address }} ({{ pool.token1.reserve }})</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
 import Vue from 'vue'
 import axios from 'axios'
 import { ethers, BigNumber, Contract } from 'ethers'
 import { Event, Pool, Token } from '~/components/types'
 import {
     ethRPC,
     ftmRPC,
     plgRPC,
     bscRPC,
     ethBaseURL,
     ftmBaseURL,
     plgBaseURL,
     bscBaseURL,
     gtonETH,
     gtonFTM,
     gtonPLG,
     gtonBSC,
     factoryETHsushi,
     factoryPLGsushi,
     factoryPLGquick,
     factoryFTMspooky,
     factoryFTMspirit,
     factoryBSCpancake,
     topicV2PairCreated
 } from '~/components/constants'

 async function sleep(ms: number) {
     await _sleep(ms);
 }

 function _sleep(ms: number) {
     return new Promise((resolve) => setTimeout(resolve, ms));
 }

export function formatAmountToPrecision(
  value: string,
  precision: number
): string {
  let dotAt = value.indexOf(".");
  return dotAt !== -1 ? value.slice(0, ++dotAt + precision) : value;
}
export function formatToken(num: number): number {
  let res = num / Math.pow(10, 18);
  return parseFloat(res.toFixed(4));
}
export function numberWithCommas(x: number): string {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
 export default Vue.extend({
     data () {
         return {
             tokenAddress: "",
             ftmApiKey: "",
             ethApiKey: "",
             bscApiKey: "",
             plgApiKey: "",
             ethRPCKey: "",
             ftmAddress: "0xC1Be9a4D5D45BeeACAE296a7BD5fADBfc14602C4",
             ethAddress: "0x01e0E2e61f554eCAaeC0cC933E739Ad90f24a86d",
             bscAddress: "0x64D5BaF5ac030e2b7c435aDD967f787ae94D0205",
             plgAddress: "0xf480f38c366daac4305dc484b2ad7a496ff00cea",
             events: [] as Event[],
             pools: [] as Pool[]
         }
     },
     methods: {
         async update () {
             this.events = []

             await this.processDEX(
                 ftmBaseURL,
                 factoryFTMspooky,
                 this.ftmAddress,
                 this.ftmApiKey,
                 "FTM",
                 "SpookySwap",
                 ftmRPC
             )
             await this.processDEX(
                 ftmBaseURL,
                 factoryFTMspirit,
                 this.ftmAddress,
                 this.ftmApiKey,
                 "FTM",
                 "SpiritSwap",
                 ftmRPC
             )
             await this.processDEX(
                 plgBaseURL,
                 factoryPLGquick,
                 this.plgAddress,
                 this.plgApiKey,
                 "PLG",
                 "QuickSwap",
                 plgRPC
             )
             await this.processDEX(
                 plgBaseURL,
                 factoryPLGsushi,
                 this.plgAddress,
                 this.plgApiKey,
                 "PLG",
                 "SushiSwap",
                 plgRPC
             )
             await this.processDEX(
                 ethBaseURL,
                 factoryETHsushi,
                 this.ethAddress,
                 this.ethApiKey,
                 "ETH",
                 "SushiSwap",
                 ethRPC + this.ethRPCKey
             )
             await this.processDEX(
                 bscBaseURL,
                 factoryBSCpancake,
                 this.bscAddress,
                 this.bscApiKey,
                 "BSC",
                 "PancakeSwap",
                 bscRPC
             )
         },
         async processDEX (
             url: string,
             factory: string,
             token: string,
             apikey: string,
             chain: string,
             dex: string,
             rpc: string
         ) {
             let url1 = url
             + "/api?module=logs&action=getLogs"
             + "&fromBlock=earliest" + "&toBlock=latest"
             + "&address=" + factory
             + "&topic0=" + topicV2PairCreated
             + "&topic1=" + ethers.utils.hexZeroPad(token, 32)
             + "&apikey=" + apikey
             let es1 = await this.request(url1)
             let events1 = this.processEvents(es1)
             if (events1.length > 0) {
                 await this.processPools(events1, chain, dex, rpc)
             }

             let url2 = url
             + "/api?module=logs&action=getLogs"
             + "&fromBlock=earliest" + "&toBlock=latest"
             + "&address=" + factory
             + "&topic0=" + topicV2PairCreated
             + "&topic2=" + ethers.utils.hexZeroPad(token, 32)
             + "&apikey=" + apikey
             let es2 = await this.request(url2)
             let events2 = this.processEvents(es2)
             if (events2.length > 0) {
                await this.processPools(events2, chain, dex, rpc)
             }
         },
         async processPools (events: Event[], chain: string, dex: string, rpc: string) {
             for (var e = 0; e < events.length; e++) {
                 const poolAbi = [
                     "function getReserves() external view returns (uint112, uint112, uint32)",
                     "function token0() external view returns (address)",
                     "function token1() external view returns (address)"
                 ]
                 const tokenAbi = [
                     "function name() view returns (string)",
                     "function symbol() view returns (string)",
                     "function decimals() external pure returns (uint8)"
                 ]

                 const provider = new ethers.providers.JsonRpcProvider(rpc)

                 let poolAddress = this.toAddress(ethers.utils.hexDataSlice(events[e].data, 0, 32))

                 let token0Address = this.toAddress(events[e].topics[1])
                 let token1Address = this.toAddress(events[e].topics[2])

                 var token0: Token
                 var token1: Token

                 var reserve0: BigNumber = BigNumber.from(0)
                 var reserve1: BigNumber = BigNumber.from(0)

                 try {
                     let poolContract = new Contract(poolAddress, poolAbi, provider)
                     let [r0, r1] = await poolContract.getReserves()
                     reserve0 = r0
                     reserve1 = r1
                 } catch(e) {
                     console.log(e)
                 }

                 try {
                     const token = new Contract(token0Address, tokenAbi, provider)
                     const name = await token.name()
                     const symbol = await token.symbol()
                     const decimals = await token.decimals()
                     token0 = {
                         symbol: symbol,
                         name: name,
                         address: token0Address,
                         reserve: ethers.utils.formatUnits(reserve0, decimals)
                     }
                 } catch(e) {
                     console.log(e)
                     token0 = {
                         symbol: "",
                         name: "",
                         address: token0Address,
                         reserve: reserve0.toString()
                     }
                }
                 try {
                     const token = new Contract(token1Address, tokenAbi, provider)
                     const name = await token.name()
                     const symbol = await token.symbol()
                     const decimals = await token.decimals()
                     token1 = {
                         symbol: symbol,
                         name: name,
                         address: token1Address,
                         reserve: ethers.utils.formatUnits(reserve1, decimals)
                     }
                 } catch(e) {
                     console.log(e)
                     token1 = {
                         symbol: "",
                         name: "",
                         address: token1Address,
                         reserve: reserve1.toString()
                     }
                }
                 var pool: Pool = {
                     chain: chain,
                     dex: dex,
                     factory: events[e].address,
                     address: poolAddress,
                     createdBlockNumber: events[e].blockNumber,
                     createdTimestamp: events[e].timeStamp,
                     createdDate: events[e].date,
                     createdTransactionHash: events[e].transactionHash,
                     token0: token0,
                     token1: token1
                 }
                 if ((this.pools.find(e => (e.address == pool.address)))) { continue }
                 this.pools.push(pool)
             }
         },
         processEvents (events: any[]): Event[] {
             var es: Event[] = []
             if (events.length === 0) { return [] }
             for (var i in events) {
                 if (!events[i].blockNumber) { continue }
                 var event: Event = {
                     address: events[i].address,
                     topics: events[i].topics,
                     data: events[i].data,
                     blockNumber: BigNumber.from(events[i].blockNumber),
                     timeStamp: BigNumber.from(events[i].timeStamp),
                     date: new Date(BigNumber.from(events[i].timeStamp).toNumber() * 1000),
                     gasPrice: events[i].gasPrice == "0x" ? BigNumber.from(0) : BigNumber.from(events[i].gasPrice),
                     gasUsed: BigNumber.from(events[i].gasUsed),
                     logIndex: events[i].logIndex == "0x" ? BigNumber.from(0) : BigNumber.from(events[i].logIndex),
                     transactionHash: events[i].transactionHash,
                     transactionIndex: events[i].transactionIndex
                 }
                 if ((this.events.find(e => (e.transactionHash == event.transactionHash) && (e.logIndex.eq(event.logIndex))))) { continue }
                 es.push(event)
             }
             return es
         },
         async request (url: string): Promise<any[]> {
             console.log(url)
             try {
                 const resp = await axios.get(url)
                 return resp.data.result
             } catch(e) {
                 console.log(e)
                 return []
             }
         },
         toAddress (s: string): string {
             if (!s.startsWith("0x")) { return s }
             try {
                 return ethers.utils.hexZeroPad(ethers.utils.hexStripZeros(s), 20)
             } catch(e) {
                 console.log(e)
                 return s
             }
         }
     }
 })
</script>
