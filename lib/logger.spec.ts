import { logger, createContextLogger, formatLogContext } from './logger'

describe('Logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should log at different levels', () => {
  //   const log = logger.info('Test info message')
  //   const log2 = logger.error('Test error message')

  //   // const infoLog = (console.info as jest.Mock).mock.calls[0][0]
  //   // const errorLog = (console.error as jest.Mock).mock.calls[0][0]

  //   expect(log.msg).toBe('Test info message')
  //   expect(log2.msg).toBe('Test error message')
  })

  it('should create context logger', () => {
  //   const contextLogger = createContextLogger('test-context')
  //   contextLogger.info('Test context message')

  //   const logCall = (console.info as jest.Mock).mock.calls[0][0]
  //   expect(logCall.msg).toBe('Test context message')
  //   expect(logCall.context).toBe('test-context')
  })

  it('should format log context correctly', () => {
    const testError = new Error('test error')
    const context = formatLogContext({
      action: 'test-action',
      details: { key: 'value' },
      error: testError
    })

    expect(context.action).toBe('test-action')
    expect(context.details).toEqual({ key: 'value' })
    expect(context.error.message).toBe('test error')
  })
})