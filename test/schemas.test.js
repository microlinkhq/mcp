import test from 'node:test'
import assert from 'node:assert/strict'

import {
  extractInputSchema,
  insightsInputSchema,
  markdownInputSchema,
  metaInputSchema,
  paletteInputSchema,
  pdfInputSchema,
  screenshotInputSchema,
  textInputSchema
} from '../src/schemas.js'

test('extract schema accepts minimal valid payload', () => {
  const result = extractInputSchema.safeParse({
    url: 'https://microlink.io'
  })

  assert.equal(result.success, true)
})

test('extract schema rejects unknown top-level keys', () => {
  const result = extractInputSchema.safeParse({
    url: 'https://microlink.io',
    unknownParam: true
  })

  assert.equal(result.success, false)
  assert.match(result.error.issues[0].message, /Unrecognized key|unrecognized key/i)
})

test('screenshot schema rejects invalid screenshot type', () => {
  const result = screenshotInputSchema.safeParse({
    url: 'https://microlink.io',
    screenshot: {
      type: 'webp'
    }
  })

  assert.equal(result.success, false)
})

test('screenshot schema rejects unknown nested screenshot keys', () => {
  const result = screenshotInputSchema.safeParse({
    url: 'https://microlink.io',
    screenshot: {
      fullPage: true,
      randomExtraKey: 'nope'
    }
  })

  assert.equal(result.success, false)
})

test('pdf schema rejects scale values out of allowed range', () => {
  const result = pdfInputSchema.safeParse({
    url: 'https://microlink.io',
    pdf: {
      scale: 3
    }
  })

  assert.equal(result.success, false)
})

test('data schema accepts a valid single rule object', () => {
  const result = extractInputSchema.safeParse({
    url: 'https://microlink.io',
    data: {
      price: { selector: '.price', type: 'number' },
      title: { selector: 'h1', attr: 'text' }
    }
  })

  assert.equal(result.success, true)
})

test('data schema accepts an array of fallback rule objects', () => {
  const result = extractInputSchema.safeParse({
    url: 'https://microlink.io',
    data: {
      price: [
        { selector: '.price-new', type: 'number' },
        { selector: '.price-old', type: 'number' }
      ]
    }
  })

  assert.equal(result.success, true)
})

test('data schema rejects non-object rule values', () => {
  const result = extractInputSchema.safeParse({
    url: 'https://microlink.io',
    data: {
      price: 'not-a-rule'
    }
  })

  assert.equal(result.success, false)
})

test('meta schema accepts minimal valid payload', () => {
  const result = metaInputSchema.safeParse({
    url: 'https://microlink.io'
  })

  assert.equal(result.success, true)
})

test('meta schema accepts meta: false to disable extraction', () => {
  const result = metaInputSchema.safeParse({
    url: 'https://microlink.io',
    meta: false
  })

  assert.equal(result.success, true)
})

test('meta schema accepts config object with include/exclude fields', () => {
  const result = metaInputSchema.safeParse({
    url: 'https://microlink.io',
    meta: { logo: true, title: true, image: false }
  })

  assert.equal(result.success, true)
})

test('meta schema rejects unknown fields in config object', () => {
  const result = metaInputSchema.safeParse({
    url: 'https://microlink.io',
    meta: { logo: true, unknownField: true }
  })

  assert.equal(result.success, false)
})

test('palette schema accepts minimal valid payload', () => {
  const result = paletteInputSchema.safeParse({
    url: 'https://microlink.io'
  })

  assert.equal(result.success, true)
})

test('palette schema accepts palette: true', () => {
  const result = paletteInputSchema.safeParse({
    url: 'https://microlink.io',
    palette: true
  })

  assert.equal(result.success, true)
})

test('palette schema rejects non-boolean palette value', () => {
  const result = paletteInputSchema.safeParse({
    url: 'https://microlink.io',
    palette: 'yes'
  })

  assert.equal(result.success, false)
})

test('palette schema rejects unknown top-level keys', () => {
  const result = paletteInputSchema.safeParse({
    url: 'https://microlink.io',
    palette: true,
    unknownParam: 'nope'
  })

  assert.equal(result.success, false)
  assert.match(result.error.issues[0].message, /Unrecognized key|unrecognized key/i)
})

test('insights schema accepts lighthouse config object', () => {
  const result = insightsInputSchema.safeParse({
    url: 'https://microlink.io',
    insights: {
      lighthouse: {
        output: 'html',
        preset: 'desktop',
        onlyCategories: ['accessibility']
      },
      technologies: true
    }
  })

  assert.equal(result.success, true)
})

test('markdown schema accepts minimal valid payload', () => {
  const result = markdownInputSchema.safeParse({
    url: 'https://microlink.io'
  })

  assert.equal(result.success, true)
})

test('markdown schema accepts optional apiKey', () => {
  const result = markdownInputSchema.safeParse({
    url: 'https://microlink.io',
    apiKey: 'my-key'
  })

  assert.equal(result.success, true)
})

test('markdown schema rejects unknown top-level keys', () => {
  const result = markdownInputSchema.safeParse({
    url: 'https://microlink.io',
    unknownParam: true
  })

  assert.equal(result.success, false)
  assert.match(result.error.issues[0].message, /Unrecognized key|unrecognized key/i)
})

test('text schema accepts minimal valid payload', () => {
  const result = textInputSchema.safeParse({
    url: 'https://microlink.io'
  })

  assert.equal(result.success, true)
})

test('text schema accepts optional apiKey', () => {
  const result = textInputSchema.safeParse({
    url: 'https://microlink.io',
    apiKey: 'my-key'
  })

  assert.equal(result.success, true)
})

test('text schema rejects unknown top-level keys', () => {
  const result = textInputSchema.safeParse({
    url: 'https://microlink.io',
    unknownParam: true
  })

  assert.equal(result.success, false)
  assert.match(result.error.issues[0].message, /Unrecognized key|unrecognized key/i)
})
