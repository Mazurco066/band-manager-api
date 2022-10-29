// Service Dependencies
import puppeteer from 'puppeteer'
import { options } from 'main/config'

// Dependencies
import { Injectable } from '@nestjs/common'
import { IBaseWebscrap, IBaseResponse, baseResponse } from '@/domain/shared'

@Injectable()
export class WebscrapService implements IBaseWebscrap {

  /**
   * Scraps daily liturgy from pocket terço
   * @param date - Date string on DD/MM/YYYY format
   * @returns Array - Scrapped info as array
   */
  public async scrapDailyLiturgy (date: string): Promise<IBaseResponse> {
    let browser = null
    try {

      // Retrieve div content from pocket terço
      // const browser = await puppeteer.launch({
      //   args : [
      //     '--no-sandbox',
      //     '--disable-setuid-sandbox'
      //   ]
      // })
      browser = await puppeteer.connect({ browserWSEndpoint: `wss://chrome.browserless.io?token=${options.BROWSERLESS_KEY}` })
      const page  = await browser.newPage()
      await page.goto(`https://pocketterco.com.br/liturgia/${date}`)

      // Scrapped data array
      const results = []

      // Retrieve "Antífona de entrada"
      const antifonaEntradaelement = await page.$('#antifonaEntradaMissal')
      const antifonaEntradaAsText = await page.evaluate((el: any) => el.textContent, antifonaEntradaelement)

      // Retrieve "Primeira Leitura", "Salmo", "Segunda Leitura" and "Evangelho"
      const writtingsElements = await page.$$('.fonte-georgia')
      const elements = await Promise.all(writtingsElements.map(async elm => page.evaluate((el: any) => el.textContent, elm)))
      const filteredElements = elements.map((el: string) => el.trim()).filter(
        (el: string) =>
          el.startsWith('Primeira Leitura') ||
          el.startsWith('Salmo Responsorial') ||
          el.startsWith('Segunda Leitura') ||
          el.startsWith('Evangelho')
      )

      // Retrieve "Aleluia" and "Antífona de ofertório"
      const moreElements = await page.$$('.bloco-oracao')
      const extraElements = await Promise.all(moreElements.map(async (elm: any) => page.evaluate((el: any) => el.textContent, elm)))
      const filteredExtraElements = extraElements.map((el: string) => el.trim()).filter(
        (el: string) =>
          el.startsWith('℟. Aleluia, Aleluia, Aleluia.') ||
          el.startsWith('Antífona do Ofertório')
      )

      // Retrieve "Antifona de Comunhão"
      const antifonaComunhaoElement = await page.$('#antifonaComunhaoMissal')
      const antifonaComunhaoAsText = await page.evaluate((el: any) => el.textContent, antifonaComunhaoElement)
      
      // Add "Antifona de Entrada" if it was found
      if (antifonaEntradaAsText) results.push({
        title: 'Antífona de entrada',
        content: antifonaEntradaAsText
      })

      // Add scrapped writtings with correct titles
      filteredElements.forEach((el: string) => {
        results.push({
          title: el.split('(')[0].trim(),
          content: el.split(')')[1].trim()
        })
      })

      // Add "Antifona de Comunhão" if it was found
      if (antifonaComunhaoAsText) results.push({
        title: 'Antífona de Comunhão',
        content: antifonaComunhaoAsText
      })

      // Add scrapped writtings with correct titles
      filteredExtraElements.forEach((el: string) => {
        if (el.includes('Aleluia')) {
          results.push({
            title: 'Aleluia',
            content: el.split('℣.')[1].trim()
          })
        } else {
          results.push({
            title: 'Antífona do Ofertório',
            content: el.split('Antífona do Ofertório\n')[1].trim()
          })
        }
      })

      // Close browser
      await browser.close()

      // Return scrapped data
      return baseResponse(200, 'URL Successfully scraped', results)
      
    } catch (err) {
      if (browser) await browser.close()
      return baseResponse(500, err.message || 'A Webscrap error ocourred. Try again later.')
    }
  }

  /**
   * Scraps a song from cifraclub.com.br
   * @param url as `string` from cifra club webpage
   * @returns Song as text inside base reponse
   */
  public async scrapCifraClubSong (url: string): Promise<IBaseResponse> {
    let browser = null
    try {

      // Retrieve div content from cifra club
      // const browser = await puppeteer.launch({
      //   args : [
      //     '--no-sandbox',
      //     '--disable-setuid-sandbox'
      //   ]
      // })
      browser = await puppeteer.connect({ browserWSEndpoint: `wss://chrome.browserless.io?token=${options.BROWSERLESS_KEY}` })
      const page  = await browser.newPage()
      await page.goto(url)

      // Retrieve song body
      const songElement = await page.$('.cifra_cnt pre')
      const songAsText = await page.evaluate((el: any) => el.textContent, songElement)

      // Retrieve song title
      const titleElement = await page.$('.t1')
      const titleAsText = await page.evaluate((el: any) => el.textContent, titleElement)

      // Retrieve song writter
      const writterElement = await page.$('.t3')
      const writterAsText = await page.evaluate((el: any) => el.textContent, writterElement)

      // Retrieve song writter
      const toneElement = await page.$('#cifra_tom a')
      const toneAsText = await page.evaluate((el: any) => el.textContent, toneElement)

      // Close browser
      await browser.close()
      if (!songAsText) baseResponse(404, `Song from "${url}" was not found!`)
      
      // Return scrapped data
      return baseResponse(200, 'URL Successfully scraped', {
        writter: writterAsText,
        text: songAsText,
        tone: toneAsText,
        title: titleAsText
      })

    } catch (err) {
      if (browser) await browser.close()
      return baseResponse(500, err.message || 'A Webscrap error ocourred. Try again later.')
    }
  }

  /**
   * Scraps a song from cifras.com.br
   * @param url as `string` from cifra club webpage
   * @returns Song as text inside base reponse
   */
   public async scrapCifrasSong (url: string): Promise<IBaseResponse> {
    let browser = null
    try {

      // Retrieve div content from cifras
      // const browser = await puppeteer.launch({
      //   args : [
      //     '--no-sandbox',
      //     '--disable-setuid-sandbox'
      //   ]
      // })
      browser = await puppeteer.connect({ browserWSEndpoint: `wss://chrome.browserless.io?token=${options.BROWSERLESS_KEY}` })
      const page  = await browser.newPage()
      await page.goto(url)

      // Retrieve song body
      const songElement = await page.$('#core')
      const songAsText = await page.evaluate((el: any) => el.textContent, songElement)

      // Retrieve song title
      const titleElement = await page.$('.info-art h1')
      const titleAsText = await page.evaluate((el: any) => el.textContent, titleElement)

      // Retrieve song writter
      const writterElement = await page.$('.info-art h2')
      const writterAsText = await page.evaluate((el: any) => el.textContent, writterElement)

      // Retrieve song writter
      const toneElement = await page.$('#tom_atual')
      const toneAsText = await page.evaluate((el: any) => el.textContent, toneElement)

      // Close browser
      await browser.close()
      if (!songAsText) baseResponse(404, `Song from "${url}" was not found!`)
    
      // Return scrapped data
      return baseResponse(200, 'URL Successfully scraped', {
        writter: writterAsText,
        text: songAsText,
        tone: toneAsText,
        title: titleAsText
      })

    } catch (err) {
      if (browser) await browser.close()
      return baseResponse(500, err.message || 'A Webscrap error ocourred. Try again later.')
    }
  }
}