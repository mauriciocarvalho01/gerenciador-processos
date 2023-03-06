export class MessageBroker {
  constructor({ queueData, messages, channel, inQueue }) {
    this.queueData = queueData
    this.messages = messages
    this.channel = channel
    this.inQueue = inQueue
  }
}
