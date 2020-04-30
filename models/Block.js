const { Schema, model } = require('mongoose')
const { computeHash } = require('../utils/computeHash')
const { createChain } = require('../utils/chainHelpers')
const Blockchain = require('./Blockchain')


const DIFFICULTY = 2

const blockSchema = new Schema({
    timestamp: { type: String, default: Date.now },
    previousHash: { type: String },
    // transactions: [{}],
    data: { type: String },
    chain: { type: Schema.Types.ObjectId, ref: 'Blockchain', default: '5ea47b69acd66cc296101ec1' },
    hash: { type: String, default: '' },
    nonce: { type: Number, default: 0 }
})

blockSchema.method({
    computeHash: function() {
        const { timestamp, previousHash, data } = this
        const hash = computeHash(timestamp, previousHash, data)
        return hash
    },
    mine: async function() {
        const { chain, computeHash, timestamp, nonce } = this
        // not good ----- const blockchain = await Blockchain.findById(chain)
        const blockchain = Blockchain()
        const latestBlock = blockchain.latestBlock()
        const prevHash = await Block.findByIdAndReturnHash(latestBlock)
        this.previousHash = prevHash
        while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY)) {
            nonce++
            this.hash = computeHash()
        }
        console.log(`hash: ${this.hash},
        `)
        blockchain.chain.push(this)
        const persistChangesToDB = [blockchain.save(), this.save()]
        await Promise.all(persistChangesToDB)
        return
        // if it doesnt work, make mine a static function and `return new this`
    }
})

blockSchema.static({
    genesis: async function(chain) {
        const genesisBlock = await this.create({ 
            timestamp: '1587569720271',
            previousHash: '-',
            chain,
            hash: '0000' 
        })
        return genesisBlock
    },
    findByIdAndReturnHash: async function(id) {
        const block = await this.findById(id)
        return block.hash
    }
})

const Block = model('Block', blockSchema)

module.exports = Block