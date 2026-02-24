import { textInputSchema } from '../schemas.js'
import { registerEmbed } from './register.js'

export function text (server) {
  registerEmbed(
    server,
    'microlink_text',
    [
      'Extract plain text from any public URL via Microlink.',
      'Returns the page content as clean plain text, stripped of all HTML and formatting.',
      'Useful for getting raw text content from web pages.'
    ].join(' '),
    textInputSchema,
    { data: { text: { attr: 'text' } }, embed: 'text', meta: false }
  )
}
