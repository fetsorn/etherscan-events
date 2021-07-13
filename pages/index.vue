<template>
    <div style="font-family: monospace; height: 40vh">
        <input style="width: 200px" v-model="form.baseURL" @change="updateBaseURL()" placeholder="base URL" list="bases">
        <datalist id="bases">
            <option v-for="url in baseURLs" v-bind:value="url"></option>
        </datalist>
        <input style="width: 350px" v-model="form.apiKey" placeholder="API key">
        <br>
        <input style="width: 200px" v-model="form.fromBlock" placeholder="from" list="blocks">
        <input style="width: 200px" v-model="form.toBlock" placeholder="to" list="blocks">
        <datalist id="blocks">
            <option v-for="block in blocks" v-bind:value="block.value">{{ block.name }}</option>
        </datalist>
        <br>
        <input style="width: 600px" v-model="form.address" placeholder="address" list="addresses">
        <datalist id="addresses">
            <option v-for="addr in addresses" v-bind:value="addr.value">{{ addr.name }}</option>
        </datalist>
        <br>
        <input style="width: 600px" v-model="form.topic0" placeholder="topic0" list="topic0s">
        <datalist id="topic0s">
            <option v-for="topic0 in topic0s" v-bind:value="topic0.value">{{ topic0.name }}</option>
        </datalist>
        <br>
        <input style="width: 600px" v-model="form.topic1" placeholder="topic1">
        <input v-model="form.isTopic1" type="checkbox" placeholder="baseURL">
        <br>
        <input style="width: 600px" v-model="form.topic2" placeholder="topic2">
        <input v-model="form.isTopic2" type="checkbox" placeholder="baseURL">
        <br>
        <input style="width: 600px" v-model="form.topic3" placeholder="topic3">
        <input v-model="form.isTopic3" type="checkbox" placeholder="baseURL">
        <br>
        <input style="width: 600px" v-model="form.copybuffer" placeholder="copybuffer">
        <Button @click="form.copybuffer = hexZeroPad(form.copybuffer)">Pad</Button>
        <Button @click="form.copybuffer = hexStripZeros(form.copybuffer)">Strip</Button>
        <Button @click="form.copybuffer = toAddress(form.copybuffer)">To address</Button>
        <Button @click="form.copybuffer = toDecimal(form.copybuffer)">To decimal</Button>
        <Button @click="form.copybuffer = toHex(form.copybuffer)">To hex</Button>
        <br>
        <select v-model="template">
            <option v-for="template in templates" v-bind:value="template">
                {{template.name}}
            </option>
        </select>
        <Button @click="fill">Fill</Button>
        <br>
        <Button @click="update">Update</Button>
        <p>events: {{ events.length }}</p>
        <div style="overflow: scroll; height: 60vh;">
            <div v-for="event in events" :key="event.transactionHash + event.logIndex">
                <div style="background-color: black; height: 10px"></div>
                <p>address: {{ event.address }}</p>
                <p>topic0: {{ event.topics[0] }}</p>
                <p>topic1: {{ event.topics[1] }}</p>
                <p>topic2: {{ event.topics[2] }}</p>
                <p>topic3: {{ event.topics[3] }}</p>
                <p>data: {{ event.data }}</p>
                <p>block number: {{ event.blockNumber }}</p>
                <p>timestamp: {{ event.timeStamp }} ({{ event.date }})</p>
                <p>gas price: {{ event.gasPrice }}</p>
                <p>gas used: {{ event.gasUsed }}</p>
                <p>log index: {{ event.logIndex }}</p>
                <p>tx hash: {{ event.transactionHash }}</p>
                <p>tx index: {{ event.transactionIndex }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
 import Vue from 'vue'
 import axios from 'axios'
 import { ethers, BigNumber } from 'ethers'
 import { Option, Form, Event, Template } from '~/components/types'
 import { baseURLs, addresses, topic0s, templates } from '~/components/constants'

 async function sleep(ms: number) {
     await _sleep(ms);
 }

 function _sleep(ms: number) {
     return new Promise((resolve) => setTimeout(resolve, ms));
 }

 export default Vue.extend({
     data () {
         return {
             form: templates[0].form,
             template: templates[0],
             templates: templates,
             baseURLs: baseURLs,
             addresses: addresses,
             topic0s: topic0s,
             blocks: [] as Option[],
             events: [] as Event[]
         }
     },
     async mounted () {
         await this.updateBaseURL()
     },
     methods: {
         hexZeroPad (s: string): string {
             if (!s.startsWith("0x")) { return s }
             return ethers.utils.hexZeroPad(s, 32)
         },
         toAddress (s: string): string {
             if (!s.startsWith("0x")) { return s }
             return ethers.utils.hexZeroPad(ethers.utils.hexStripZeros(s), 20)
         },
         hexStripZeros (s: string): string {
             if (!s.startsWith("0x")) { return s }
             return ethers.utils.hexStripZeros(s)
         },
         toHex (s: string): string {
             return BigNumber.from(s).toHexString()
         },
         toDecimal (s: string): string {
             return BigNumber.from(s).toString()
         },
         async updateBaseURL () {
             this.blocks = [
                 {name: "latest", value: "latest"},
                 {name: "earliest", value: "earliest"},
                 {name: "pending", value: "pending"},
                 {name: "1 day ago", value: await this.ago(60 * 60 * 24)},
                 {name: "1 week ago", value: await this.ago(60 * 60 * 24 * 7)},
                 {name: "2 weeks ago", value: await this.ago(60 * 60 * 24 * 14)}
             ]
         },
         async ago (duration: number): Promise<string> {
             // call with random delay for rate limit of 3s
             await sleep(Math.floor(Math.random() * (3000 + 1)))
             const { baseURL, apiKey } = this.form
             let timestamp = Math.round((new Date((new Date()).getTime() - duration)).getTime() / 1000)
             let url = baseURL + "/api?module=block&action=getblocknobytime" + "&timestamp=" + timestamp + "&closest=after" + "&apikey=" + apiKey
             try {
                 const resp = await axios.get(url)
                 if (resp.data.status == "0") { console.log(resp.data.message); return "latest" }
                 return resp.data.result
             } catch(e) {
                 console.log(e)
                 return "latest"
             }
         },
         async fill () {
             this.form = this.template.form
         },
         async update () {
             this.events = []
             var fromBlock: string = this.form.fromBlock
             while (true) {
                 const events: any[] = await this.request(fromBlock)
                 this.process(events)
                 // rate limit of 1000 events
                 if (events.length < 1000) {
                     break
                 }
                 // request again starting from the blockNumber of the last event
                 fromBlock = this.events[this.events.length-1].blockNumber.toString()
             }
         },
         async request (fromBlock: string): Promise<any[]> {
             const { baseURL, toBlock, address, topic0, isTopic1, topic1, isTopic2, topic2, isTopic3, topic3, apiKey } = this.form
             let topics = "&topic0=" + topic0 + (isTopic1 ? "&topic1=" + topic1 : "") + (isTopic2 ? "&topic2=" + topic2 : "") + (isTopic3 ? "&topic3=" + topic3 : "")
             let url = baseURL + "/api?module=logs&action=getLogs" + "&fromBlock=" + fromBlock + "&toBlock=" + toBlock + "&address=" + address + topics + "&apikey=" + apiKey
             console.log(url)
             try {
                 const resp = await axios.get(url)
                 return resp.data.result
             } catch(e) {
                 console.log(e)
                 return []
             }
         },
         process (events: any[]) {
             if (events.length === 0) { return }
             for (var i in events) {
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
                 this.events.push(event)
             }
         }
     }
 })
</script>
