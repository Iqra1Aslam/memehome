// ablyClient.ts
import Ably from "ably";

const ably = new Ably.Realtime("qR94EA.6wk1Hw:8rEGkjC032riq48eMyuO0sHv4K_j04YjhZGpoYF1hCU");

// Get the shared channel – reuse this everywhere
const channel = ably.channels.get("coins");

export { ably, channel };
