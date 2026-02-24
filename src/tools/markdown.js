import { markdownInputSchema } from '../schemas.js'
import { registerEmbed } from './register.js'

export function markdown (server) {
  registerEmbed(
    server,
    'microlink_markdown',
    [
      'Convert any public URL to Markdown via Microlink.',
      'Returns the page content as clean Markdown text.',
      'Useful for extracting readable content from web pages, articles, and documentation.'
    ].join(' '),
    markdownInputSchema,
    { data: { markdown: { attr: 'markdown' } }, embed: 'markdown', meta: false }
  )
}
