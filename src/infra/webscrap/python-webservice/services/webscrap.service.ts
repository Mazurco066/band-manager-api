// Service dependencies
import axios from 'axios'

// Dependencies
import { Injectable } from '@nestjs/common'
import { IBaseWebscrap, IBaseResponse, baseResponse } from '@/domain/shared'

// Types
import type { AxiosResponse } from 'axios'

type SongScrapReturn = {
  status: number
  message: string
  scraped_data: {
    songBody: string
    songTone: string
    songTitle: string
    songWritter: string
  }
}

type Leitura = {
  referencia: string
  titulo: string
  texto: string
}

type Salmo = {
  referencia: string
  refrao: string
  texto: string
}

type Evangelho = {
  referencia: string
  titulo: string
  texto: string
}

type LiturgiaData = {
  data: string
  liturgia: string
  cor: string
  dia: string
  oferendas: string
  comunhao: string
  primeiraLeitura: Leitura
  segundaLeitura: Leitura | string
  salmo: Salmo
  evangelho: Evangelho
}

@Injectable()
export class PythonWebscrapService implements IBaseWebscrap {

  /**
   * Scraps daily liturgy from external api
   * @param date - Date string on DD/MM/YYYY format
   * @returns Array - Scrapped info as array
   */
  public async scrapDailyLiturgy (date: string): Promise<IBaseResponse> {
    try {
      // Retrieve liturgy from given date
      const response: AxiosResponse<LiturgiaData> = await axios.get('https://liturgia.up.railway.app', {
        params: {
          dia: date.split('/')[0],
          mes: date.split('/')[1]
        }
      })

      // Push scraped data
      const results: { title: string, content: string }[] = []
      results.push({
        title: 'Liturgia diária',
        content: response.data.dia
      })
      results.push({
        title: `Primeira leitura - ${response.data.primeiraLeitura.referencia}`,
        content: response.data.primeiraLeitura.texto
      })
      results.push({
        title: `Salmo responsorial (${response.data.salmo.referencia})`,
        content: response.data.salmo.texto
      })
      if (typeof response.data.segundaLeitura !== 'string') {
        results.push({
          title: `Segunda leitura - ${response.data.segundaLeitura.referencia}`,
          content: response.data.segundaLeitura.texto
        })
      }
      results.push({
        title: 'Evangelho',
        content: response.data.evangelho.texto
      })
      results.push({
        title: 'Oferendas',
        content: response.data.oferendas
      })
      results.push({
        title: 'Comunhão',
        content: response.data.comunhao
      })
    
       // Return scrapped data
       return baseResponse(200, 'Liturgy Successfully scraped', results)
      
    } catch (err) {
      return baseResponse(500, err.message || 'A Webscrap error ocourred. Try again later.')
    }
  }

  /**
   * Scraps a song from cifraclub.com.br
   * @param url as `string` from cifra club webpage
   * @returns Song as text inside base reponse
   */
  public async scrapCifraClubSong (url: string): Promise<IBaseResponse> {
    try {

      // Retrieve track from given uri
      const response: AxiosResponse<SongScrapReturn> = await axios.post(
        'http://localhost:8000/scrap_song_cifra_club',
        { uri: url }
      )
      
      // Return scrapped data
      return baseResponse(200, 'URL Successfully scraped', {
        loot: response.data.scraped_data.songBody,
        title: response.data.scraped_data.songTitle,
        writter: response.data.scraped_data.songWritter,
        tone: response.data.scraped_data.songTone
      })

    } catch (err) {
      return baseResponse(500, err.message || 'A Webscrap error ocourred. Try again later.')
    }
  }

  /**
   * Scraps a song from cifras.com.br
   * @param url as `string` from cifra club webpage
   * @returns Song as text inside base reponse
   */
  public async scrapCifrasSong (url: string): Promise<IBaseResponse> {
    try {

      // Retrieve track from given uri
      const response: AxiosResponse<SongScrapReturn> = await axios.post(
        'http://localhost:8000/scrap_song_cifras',
        { uri: url }
      )
    
      // Return scrapped data
      return baseResponse(200, 'URL Successfully scraped', {
        loot: response.data.scraped_data.songBody,
        title: response.data.scraped_data.songTitle,
        writter: response.data.scraped_data.songWritter,
        tone: 'C' // Default tone because cifras do not scrap song
      })

    } catch (err) {
      return baseResponse(500, err.message || 'A Webscrap error ocourred. Try again later.')
    }
  }
}