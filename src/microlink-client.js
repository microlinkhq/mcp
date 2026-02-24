import mql from '@microlink/mql'

const RESPONSE_HEADER_KEYS = [
  'x-request-id',
  'x-pricing-plan',
  'x-cache-status',
  'x-cache-ttl',
  'x-rate-limit-limit',
  'x-rate-limit-remaining',
  'x-rate-limit-reset',
  'x-response-time',
  'content-type',
  'content-encoding'
]

function isPlainObject (value) {
  return Object.prototype.toString.call(value) === '[object Object]'
}

function isObject (value) {
  return value !== null && typeof value === 'object'
}

function hasSerializableValue (value) {
  if (value === undefined || value === null) {
    return false
  }

  if (Array.isArray(value)) {
    return value.length > 0
  }

  if (isPlainObject(value)) {
    return Object.values(value).some(hasSerializableValue)
  }

  return true
}

function getHeaderValue (headers, headerName) {
  if (!headers) {
    return null
  }

  if (typeof headers.get === 'function') {
    const value = headers.get(headerName)
    return value ?? null
  }

  if (typeof headers !== 'object') {
    return null
  }

  const lookup = headerName.toLowerCase()

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === lookup) {
      return value
    }
  }

  return null
}

function pickResponseHeaders (headers) {
  const output = {}

  for (const headerName of RESPONSE_HEADER_KEYS) {
    const value = getHeaderValue(headers, headerName)
    if (value !== null) {
      output[headerName] = value
    }
  }

  return output
}

function withForcedFlags (opts, forcedFlags = {}) {
  const nextOpts = { ...opts }

  for (const [flagName, flagValue] of Object.entries(forcedFlags)) {
    if (!hasSerializableValue(nextOpts[flagName])) {
      nextOpts[flagName] = flagValue
    }
  }

  return nextOpts
}

function getEndpointFromRequestUrl (requestUrl) {
  try {
    return new URL(requestUrl).origin
  } catch (_) {
    return requestUrl
  }
}

function stripResponseFromBody (body) {
  if (!isPlainObject(body)) {
    return body
  }

  const { response, ...payload } = body
  return payload
}

function toErrorBody (error, requestUrl) {
  if (!isObject(error)) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : String(error),
      url: requestUrl
    }
  }

  const payload = {}

  for (const key of ['status', 'data', 'more', 'code', 'message', 'url']) {
    if (error[key] !== undefined) {
      payload[key] = error[key]
    }
  }

  if (payload.status === undefined) {
    payload.status = 'error'
  }

  if (payload.message === undefined) {
    payload.message = error.message || 'Microlink request failed.'
  }

  if (payload.url === undefined) {
    payload.url = requestUrl
  }

  return payload
}

export async function callMicrolink ({ params, forcedFlags = {} }) {
  const { url, apiKey: requestApiKey, ...rawOpts } = params
  const envApiKey = process.env.MICROLINK_API_KEY
  const apiKey = requestApiKey || envApiKey
  const opts = withForcedFlags(rawOpts, forcedFlags)

  if (apiKey) {
    opts.apiKey = apiKey
  }

  const [requestUrl, requestOpts] = mql.getApiUrl(url, opts, {
    headers: {
      accept: 'application/json'
    }
  })
  const endpoint = getEndpointFromRequestUrl(requestUrl)

  try {
    const body = await mql.fetchFromApi(requestUrl, requestOpts)
    const response = body?.response

    return {
      ok: true,
      statusCode: response?.statusCode ?? 200,
      requestUrl,
      finalUrl: response?.url ?? requestUrl,
      endpoint,
      headers: pickResponseHeaders(response?.headers),
      body: stripResponseFromBody(body)
    }
  } catch (error) {
    return {
      ok: false,
      statusCode: error?.statusCode ?? 500,
      requestUrl,
      finalUrl: error?.url ?? requestUrl,
      endpoint,
      headers: pickResponseHeaders(error?.headers),
      body: toErrorBody(error, requestUrl)
    }
  }
}

export async function callMicrolinkEmbed ({ params, forcedFlags = {} }) {
  const { url, apiKey: requestApiKey, ...rawOpts } = params
  const envApiKey = process.env.MICROLINK_API_KEY
  const apiKey = requestApiKey || envApiKey
  const opts = withForcedFlags(rawOpts, forcedFlags)

  if (apiKey) {
    opts.apiKey = apiKey
  }

  const [requestUrl] = mql.getApiUrl(url, opts, {
    headers: {
      accept: 'text/plain'
    }
  })

  const response = await fetch(requestUrl, {
    headers: {
      accept: 'text/plain'
    }
  })

  const text = await response.text()

  if (!response.ok) {
    let errorBody
    try {
      errorBody = JSON.parse(text)
    } catch {
      errorBody = { status: 'error', message: text }
    }
    return { ok: false, statusCode: response.status, body: text, error: errorBody }
  }

  return { ok: true, statusCode: response.status, body: text }
}

export function asEmbedToolResult (result) {
  if (!result.ok) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: JSON.stringify(result.error, null, 2)
        }
      ]
    }
  }

  return {
    isError: false,
    content: [
      {
        type: 'text',
        text: result.body
      }
    ]
  }
}

export function asToolResult (result) {
  const output = {
    endpoint: result.endpoint,
    requestUrl: result.requestUrl,
    finalUrl: result.finalUrl,
    statusCode: result.statusCode,
    responseHeaders: result.headers,
    microlink: result.body
  }

  const isMicrolinkError = result.body?.status && result.body.status !== 'success'
  const isError = !result.ok || isMicrolinkError

  return {
    isError,
    structuredContent: output,
    content: [
      {
        type: 'text',
        text: JSON.stringify(output, null, 2)
      }
    ]
  }
}
