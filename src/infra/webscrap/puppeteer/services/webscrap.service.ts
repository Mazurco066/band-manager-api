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

      // Retrieve song body
      const songElement = await page.$('.cifra_cnt pre')
      const songAsText = await page.evaluate(el => el.textContent, songElement)

      // Retrieve song title
      const titleElement = await page.$('.t1')
      const titleAsText = await page.evaluate(el => el.textContent, titleElement)

      // Retrieve song writter
      const writterElement = await page.$('.t3')
      const writterAsText = await page.evaluate(el => el.textContent, writterElement)

      // Retrieve song writter
      const toneElement = await page.$('#cifra_tom a')
      const toneAsText = await page.evaluate(el => el.textContent, toneElement)

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

      // Retrieve song body
      const songElement = await page.$('#core')
      const songAsText = await page.evaluate(el => el.textContent, songElement)

      // Retrieve song title
      const titleElement = await page.$('.info-art h1')
      const titleAsText = await page.evaluate(el => el.textContent, titleElement)

      // Retrieve song writter
      const writterElement = await page.$('.info-art h2')
      const writterAsText = await page.evaluate(el => el.textContent, writterElement)

      // Retrieve song writter
      const toneElement = await page.$('#tom_atual')
      const toneAsText = await page.evaluate(el => el.textContent, toneElement)

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
      return baseResponse(500, err.message || 'A Webscrap error ocourred. Try again later.')
    }
  }
}