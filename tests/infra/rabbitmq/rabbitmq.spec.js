import { jest } from '@jest/globals'
import { Rabbitmq } from '#infra/rabbitmq'

describe('Rabbitmq', () => {
  let sut
  let anyConnection
  let fakeAmqplib
  let anyRabbitmqAddress
  let anyRabbitmqOptions
  beforeAll(async () => {
    anyRabbitmqAddress = 'amqp://admin:admin@192.168.1.7:4672'
    anyRabbitmqOptions = { clientProperties: { connection_name: 'DFE-CONSUMER' } }
    anyConnection = 'any_connection'
    fakeAmqplib = jest.unstable_mockModule('amqplib', () => ({
      connect: jest.fn()
    }))
    fakeAmqplib.connect.mockImplementation(jest.fn().mockReturnValue('any_repo'))
  })

  beforeEach(() => {
    sut = Rabbitmq.getInstance()
  })

  it('The Rabbitmq class should be instantiated only once', () => {
    const sut2 = Rabbitmq.getInstance()
    expect(sut2).toEqual(sut)
  })

  it('Should calls lib method connect with correct params', async () => {
    await sut.connect(anyRabbitmqAddress, anyRabbitmqOptions)
    expect(fakeAmqplib.connect).toHaveBeenCalledWith(anyRabbitmqAddress, anyRabbitmqOptions)
  })

  it('Should connect return an connection instance', async () => {
    const connection = await sut.connect(anyRabbitmqAddress, anyRabbitmqOptions)
    expect(connection).toBeDefined()
  })
})
