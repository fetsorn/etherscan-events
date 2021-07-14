 import { BigNumber } from 'ethers'

export interface Form {
     baseURL: string,
     fromBlock: string,
     toBlock: string,
     address: string,
     topic0: string,
     isTopic1: boolean,
     topic1: string,
     isTopic2: boolean,
     topic2: string,
     isTopic3: boolean,
     topic3: string,
     apiKey: string,
     copybuffer: string
 }
export interface Template {
     name: string,
     form: Form
 }
export interface Event {
     address: string
     topics: string[]
     data: string
     blockNumber: BigNumber
     timeStamp: BigNumber
     date: Date
     gasPrice: BigNumber
     gasUsed: BigNumber
     logIndex: BigNumber
     transactionHash: string
     transactionIndex: BigNumber
 }
export interface Option {name: string; value: string}

export interface Token {
     symbol: string
     name: string
     address: string
     reserve: string
}

export interface Pool {
     chain: string
     dex: string
     factory: string
     address: string
     createdBlockNumber: BigNumber
     createdTimestamp: BigNumber
     createdDate: Date
     createdTransactionHash: string
     token0: Token
     token1: Token
 }
