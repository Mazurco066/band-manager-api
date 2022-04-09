// Service Dependencies
import puppeteer from 'puppeteer'

// Dependencies
import { Injectable } from '@nestjs/common'
import { IBaseWebscrap, IBaseResponse, baseResponse } from '@/domain/shared'

@Injectable()
export class WebscrapService implements IBaseWebscrap {

  /**
   * Scraps a song from cifraclub.com.br
   * @param url as `string` from cifra club webpage
   * @returns Song as text inside base reponse
   */
  public async scrapCifraClubSong (url: string): Promise<IBaseResponse> {
    try {

      // Retrieve div content from cifra club
      const browser = await puppeteer.launch({
        args : [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      })
      const page  = await browser.newPage()
      await page.goto(url)
      const songElement = await page.$('.cifra_cnt pre')
      const songAsText = await page.evaluate(el => el.textContent, songElement)
      await browser.close()
      if (!songAsText) baseResponse(404, `Song from "${url}" was not found!`)
      return baseResponse(200, 'URL Successfully scraped', { text: songAsText })

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

      // Retrieve div content from cifra club
      const browser = await puppeteer.launch({
        args : [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      })
      const page  = await browser.newPage()
      await page.goto(url)
      const songElement = await page.$('#core')
      const songAsText = await page.evaluate(el => el.textContent, songElement)
      await browser.close()
      if (!songAsText) baseResponse(404, `Song from "${url}" was not found!`)
      return baseResponse(200, 'URL Successfully scraped', { text: songAsText })

    } catch (err) {
      return baseResponse(500, err.message || 'A Webscrap error ocourred. Try again later.')
    }
  }
}