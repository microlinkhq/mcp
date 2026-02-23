import { audio } from './audio.js'
import { extract } from './extract.js'
import { insights } from './insights.js'
import { meta } from './meta.js'
import { palette } from './palette.js'
import { pdf } from './pdf.js'
import { screenshot } from './screenshot.js'
import { video } from './video.js'

export function tools (server) {
  extract(server)
  screenshot(server)
  pdf(server)
  video(server)
  audio(server)
  insights(server)
  meta(server)
  palette(server)
}
