import { Http } from '#infra/http'

describe('Http', () => {
  let sut
  let httpOptions
  let url
  let returnBody
  beforeAll(() => {
    returnBody = {
      pagina: 1,
      paginacao: 999,
      total_de_paginas: 0,
      total_registros: 0,
      registros: []
    }
    url = 'https://dev.arigo.com.br/dfe/api/read/terceiros'
    httpOptions = {
      method: 'post',
      body: JSON.stringify({
        app_secret: '904c94e9993e11eb900000155d016d96',
        app_key: '8485003970470',
        params: {
          pagina: 1,
          filtro: {
            campos: {
              e: {
                terceiros_inscricao: {
                  tipo: 'IGUAL',
                  valor: '1'
                }
              }
            }
          }
        }
      }),
      headers: { 'Content-Type': 'application/json' }
    }
  })
  beforeEach(() => {
    sut = new Http()
  })

  it('Should calls get method returns data', async () => {
    const data = await sut.get(url, httpOptions)
    expect(JSON.stringify(data)).toBe(JSON.stringify(returnBody))
  })
})
