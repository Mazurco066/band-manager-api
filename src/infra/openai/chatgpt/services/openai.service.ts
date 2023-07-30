// Dependencies
import axios from 'axios'
import { Injectable } from '@nestjs/common'
import { IBaseOpenAI, IBaseResponse, baseResponse } from '@/domain/shared'
import { options } from '@/main/config'

@Injectable()
export class ChatGptService implements IBaseOpenAI {
  /**
   * Formats text on chat gpt
   * @param text - Text to be formatted
   */
  public async formatText (text: string): Promise<IBaseResponse> {
    // Request payload
    const apiUrl: string = 'https://api.openai.com/v1/completions'
    const headers = {
      'Authorization': `Bearer ${options.OPEN_AI_API_KEY}`,
      'Content-Type': 'application/json',
    }
    const data = {
      model: 'text-davinci-003',
      prompt: text,
      max_tokens: 500
    }
    // Requesting openai service
    try {
      const response = await axios.post(apiUrl, data, { headers })
      const formattedText = response.data.choices[0].text
      return baseResponse(200, 'Text successfully formated', formattedText)
    } catch (error) {
      console.error('Error calling OpenAI API:', error)
      return baseResponse(500, 'Error calling OpenAI API')
    }
  }
}