// scripts/generate-conflict.js
// Uso: node scripts/generate-conflict.js "Yemen Civil War"

const Anthropic = require('@anthropic-ai/sdk')
const fs = require('fs')
const path = require('path')
const https = require('https')
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY })

const CONFLICTS_PATH = path.join(__dirname, '../data/conflicts.json')

function checkWikiTitle(title) {
  return new Promise((resolve) => {
    const encoded = title.replace(/ /g, '_')
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(encoded)}`
    https.get(url, { headers: { 'User-Agent': 'WARROOM/1.0' } }, (res) => {
      resolve(res.statusCode === 200)
    }).on('error', () => resolve(false))
  })
}

const SYSTEM_PROMPT = `Sos un experto en geopolítica y conflictos armados globales.
Tu tarea es generar datos estructurados en JSON para un monitor de conflictos globales llamado WARROOM.

IMPORTANTE: Respondé ÚNICAMENTE con el JSON válido, sin markdown, sin explicaciones, sin bloques de código.
El JSON debe seguir EXACTAMENTE este schema:

{
  "id": string,
  "name": string,
  "slug": string,
  "region": string,
  "severity": "high" | "medium" | "low",
  "status": string,
  "since": string,
  "lat": number,
  "lng": number,
  "casualties": string,
  "displaced": string,
  "sanctions": string,
  "duration": string,
  "threat": number,
  "context": string,
  "wikiTitle": string,
  "parties": [{ "flag": string, "name": string, "role": "AGGRESSOR" | "DEFENDER" | "SUPPORTER" | "MEDIATOR" }],
  "events": [{ "time": string, "color": "red" | "amber" | "blue" | "dim", "title": string, "desc": string }]
}`

async function generateConflict(conflictName) {
  console.log(`\n🔍 Generando datos para: "${conflictName}"...\n`)

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY no encontrada en .env.local')
    process.exit(1)
  }

  // 1. Generar con Claude
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `Generá el JSON completo para este conflicto: "${conflictName}".
Usá datos reales y actualizados (2024-2025).
El wikiTitle debe ser el título EXACTO de la página Wikipedia en inglés con guiones bajos.
Las coordenadas lat/lng deben ser precisas al epicentro del conflicto.
Los eventos deben ser 4-5 eventos recientes plausibles.`
    }]
  })

  const rawText = message.content[0].text.trim()

  // 2. Parsear JSON
  let conflict
  try {
    conflict = JSON.parse(rawText)
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/)
    if (!match) {
      console.error('❌ Claude no devolvió JSON válido:\n', rawText)
      process.exit(1)
    }
    try {
      conflict = JSON.parse(match[0])
    } catch (e) {
      console.error('❌ Error parseando JSON:', e.message)
      console.error('Raw:', rawText)
      process.exit(1)
    }
  }

  console.log('✅ JSON generado:\n')
  console.log(JSON.stringify(conflict, null, 2))

  // 3. Verificar Wikipedia
  console.log(`\n🌐 Verificando Wikipedia: "${conflict.wikiTitle}"...`)
  const wikiExists = await checkWikiTitle(conflict.wikiTitle)

  if (!wikiExists) {
    console.warn(`⚠️  Wikipedia title no encontrado: "${conflict.wikiTitle}"`)
    console.warn('   Corregí manualmente el campo wikiTitle en conflicts.json\n')
  } else {
    console.log(`✅ Wikipedia OK: https://en.wikipedia.org/wiki/${conflict.wikiTitle}\n`)
  }

  // 4. Verificar duplicados
  const existing = JSON.parse(fs.readFileSync(CONFLICTS_PATH, 'utf-8'))
  const duplicate = existing.find(c => c.id === conflict.id || c.slug === conflict.slug)

  if (duplicate) {
    console.error(`❌ Ya existe un conflicto con id="${conflict.id}" o slug="${conflict.slug}"`)
    process.exit(1)
  }
  
  // Normalizar sanctions a solo número
  if (conflict.sanctions) {
    conflict.sanctions = conflict.sanctions.replace(/[^0-9]/g, '') || '0'
  }

  // Casualties: cortar paréntesis y truncar
  if (conflict.casualties) {
    if (conflict.casualties.includes('(')) {
      conflict.casualties = conflict.casualties.split('(')[0].trim()
    }
    if (conflict.casualties.length > 15) {
      conflict.casualties = conflict.casualties.substring(0, 15).trim()
    }
  }

  // 5. Guardar
  existing.push(conflict)
  fs.writeFileSync(CONFLICTS_PATH, JSON.stringify(existing, null, 2))

  console.log('─'.repeat(50))
  console.log(`Nombre:    ${conflict.name}`)
  console.log(`Slug:      ${conflict.slug}`)
  console.log(`Región:    ${conflict.region}`)
  console.log(`Severidad: ${conflict.severity}`)
  console.log(`Threat:    ${conflict.threat}/100`)
  console.log(`Wiki:      ${wikiExists ? '✅' : '⚠️ '} ${conflict.wikiTitle}`)
  console.log('─'.repeat(50))
  console.log(`\n✅ Guardado en conflicts.json (total: ${existing.length} conflictos)`)
  console.log(`\n📌 Agregá esto al mapping en app/api/wiki/[slug]/route.ts:`)
  console.log(`   '${conflict.slug}': '${conflict.wikiTitle}',\n`)
}

const conflictName = process.argv[2]
if (!conflictName) {
  console.error('❌ Falta el nombre del conflicto.')
  console.error('   Uso: node scripts/generate-conflict.js "Yemen Civil War"')
  process.exit(1)
}

generateConflict(conflictName).catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})