import { z } from 'zod'

const stringOrStringArraySchema = z.union([z.string(), z.array(z.string()).min(1)])
const stringOrNumberSchema = z.union([z.string(), z.number()])
const toggledObjectSchema = z.union([z.boolean(), z.object({}).catchall(z.unknown())])

// A single data-extraction rule: CSS selector(s) + optional attr/type/evaluate/nested data.
const dataSingleRuleSchema = z
  .object({
    selector: z.string().min(1).optional(),
    selectorAll: z.string().min(1).optional(),
    attr: z.string().min(1).optional(),
    type: z.string().min(1).optional(),
    evaluate: z.string().min(1).optional(),
    data: z.record(z.string(), z.unknown()).optional()
  })
  .catchall(z.unknown())

// A rule can also be an array of rules used as ordered fallback selectors.
const dataRuleSchema = z.union([dataSingleRuleSchema, z.array(dataSingleRuleSchema).min(1)])

const waitUntilEventSchema = z.enum(['auto', 'load', 'domcontentloaded', 'networkidle0', 'networkidle2'])

const viewportSchema = z
  .object({
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    deviceScaleFactor: z.number().positive().optional(),
    isMobile: z.boolean().optional(),
    hasTouch: z.boolean().optional(),
    isLandscape: z.boolean().optional()
  })
  .strict()

const screenshotOverlaySchema = z
  .object({
    browser: z.enum(['light', 'dark']).optional(),
    background: z.string().min(1).optional()
  })
  .strict()

export const screenshotConfigSchema = z
  .object({
    codeScheme: z.string().min(1).optional(),
    element: z.string().min(1).optional(),
    fullPage: z.boolean().optional(),
    omitBackground: z.boolean().optional(),
    overlay: screenshotOverlaySchema.optional(),
    type: z.enum(['jpeg', 'png']).optional()
  })
  .strict()

const pdfMarginSchema = z.union([
  z.string().min(1),
  z
    .object({
      top: z.string().min(1).optional(),
      bottom: z.string().min(1).optional(),
      left: z.string().min(1).optional(),
      right: z.string().min(1).optional()
    })
    .strict()
])

export const pdfConfigSchema = z
  .object({
    format: z.enum(['Letter', 'Legal', 'Tabloid', 'Ledger', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6']).optional(),
    height: z.string().min(1).optional(),
    landscape: z.boolean().optional(),
    margin: pdfMarginSchema.optional(),
    pageRanges: z.string().min(1).optional(),
    scale: z.number().min(0.1).max(2).optional(),
    width: z.string().min(1).optional()
  })
  .strict()

const lighthouseOutputSchema = z.enum(['json', 'html', 'csv'])
const lighthousePresetSchema = z.enum(['default', 'desktop', 'experimental', 'full', 'lr-desktop', 'lr-mobile', 'perf'])

const lighthouseConfigSchema = z
  .object({
    output: lighthouseOutputSchema.optional(),
    onlyCategories: stringOrStringArraySchema.optional(),
    preset: lighthousePresetSchema.optional()
  })
  .catchall(z.unknown())

export const insightsConfigSchema = z
  .object({
    lighthouse: z.union([z.boolean(), lighthouseConfigSchema]).optional(),
    technologies: z.boolean().optional()
  })
  .strict()

export const metaConfigSchema = z
  .object({
    author: z.boolean().optional(),
    date: z.boolean().optional(),
    description: z.boolean().optional(),
    image: z.boolean().optional(),
    lang: z.boolean().optional(),
    logo: z.boolean().optional(),
    publisher: z.boolean().optional(),
    title: z.boolean().optional(),
    url: z.boolean().optional()
  })
  .strict()

const baseSchema = z.object({
  url: z.string().url(),
  apiKey: z.string().min(1).optional()
})

const fullShape = {
  embed: z.string().min(1).optional(),
  function: z.string().min(1).optional(),
  iframe: toggledObjectSchema.optional(),
  meta: z.union([z.boolean(), metaConfigSchema]).optional(),
  palette: z.boolean().optional(),
  ping: toggledObjectSchema.optional()
}

const visualSchema = {
  adblock: z.boolean().optional(),
  animations: z.boolean().optional(),
  click: stringOrStringArraySchema.optional(),
  colorScheme: z.enum(['no-preference', 'light', 'dark']).optional(),
  data: z.record(z.string(), dataRuleSchema).optional(),
  device: z.string().min(1).optional(),
  filename: z.string().min(1).optional(),
  filter: z.string().min(1).optional(),
  force: z.boolean().optional(),
  headers: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  javascript: z.boolean().optional(),
  mediaType: z.enum(['screen', 'print']).optional(),
  modules: stringOrStringArraySchema.optional(),
  prerender: z.union([z.literal('auto'), z.boolean()]).optional(),
  proxy: z.union([z.string().min(1), z.object({}).catchall(z.unknown())]).optional(),
  retry: z.number().int().nonnegative().optional(),
  scripts: stringOrStringArraySchema.optional(),
  scroll: z.string().min(1).optional(),
  staleTtl: z.union([z.string(), z.number(), z.boolean()]).optional(),
  styles: stringOrStringArraySchema.optional(),
  timeout: stringOrNumberSchema.optional(),
  ttl: stringOrNumberSchema.optional(),
  viewport: viewportSchema.optional(),
  waitForSelector: z.string().min(1).optional(),
  waitForTimeout: stringOrNumberSchema.optional(),
  waitUntil: z.union([waitUntilEventSchema, z.array(waitUntilEventSchema).min(1)]).optional()
}

export const extractInputSchema = baseSchema
  .extend(fullShape)
  .extend(visualSchema)
  .extend({
    audio: z.boolean().optional(),
    video: z.boolean().optional(),
    pdf: z.union([z.boolean(), pdfConfigSchema]).optional(),
    screenshot: z.union([z.boolean(), screenshotConfigSchema]).optional(),
    insights: z.union([z.boolean(), insightsConfigSchema]).optional()
  })
  .strict()

export const screenshotInputSchema = baseSchema
  .extend(visualSchema)
  .extend({
    screenshot: screenshotConfigSchema.optional()
  })
  .strict()

export const pdfInputSchema = baseSchema
  .extend(visualSchema)
  .extend({
    pdf: pdfConfigSchema.optional()
  })
  .strict()

export const insightsInputSchema = baseSchema
  .extend({
    insights: insightsConfigSchema.optional()
  })
  .strict()

export const audioInputSchema = baseSchema
  .extend({
    meta: z.union([z.boolean(), metaConfigSchema]).optional(),
    audio: z.boolean().optional()
  })
  .strict()

export const videoInputSchema = baseSchema
  .extend({
    meta: z.union([z.boolean(), metaConfigSchema]).optional(),
    video: z.boolean().optional()
  })
  .strict()

export const paletteInputSchema = baseSchema
  .extend({
    meta: z.union([z.boolean(), metaConfigSchema]).optional(),
    palette: z.boolean().optional()
  })
  .strict()

export const metaInputSchema = baseSchema
  .extend({
    meta: z.union([z.boolean(), metaConfigSchema]).optional()
  })
  .strict()

export const markdownInputSchema = baseSchema.strict()

export const textInputSchema = baseSchema.strict()
