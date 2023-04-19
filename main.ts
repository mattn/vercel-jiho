import "websocket-polyfill"
import {
    nip19,
    relayInit,
    generatePrivateKey,
    getPublicKey,
    getEventHash,
    signEvent
} from 'nostr-tools'

function formatDate(date: Date) {
    return ("00" + date.getHours()).slice(-2)
        + ":" + ("00" + date.getMinutes()).slice(-2)
        + ":" + ("00" + date.getSeconds()).slice(-2)
}

const relay = relayInit('wss://nostr.wine')
relay.connect()

const decoded = nip19.decode(process.env.JIHOBOT_NSEC)
const sk = decoded.data as string
const pk = getPublicKey(sk)
let event = {
    id: '',
    kind: 1,
    pubkey: pk,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: formatDate(new Date()),
    sig: '',
}
event.id = getEventHash(event)
event.sig = signEvent(event, sk)

console.log(relay.publish(event))
relay.close()
process.exit(0)
