// scripts/update-conflict.js
// Uso: node scripts/update-conflict.js "yemen-civil-war"
// Actualiza un conflicto existente manteniendo el slug/id

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
Tu tarea es generar datos actualizados en JSON para un monitor de conflictos globales.

REGLAS ESTRICTAS DE FORMATO:
- Respondé ÚNICAMENTE con JSON válido, sin markdown, sin texto extra
- "sanctions": SOLO número entero como string, ej: "320". Sin texto descriptivo
- "casualties": formato corto, ej: "150K+", "1.2M+", "~70K"
- "displaced": formato corto, ej: "4.5M", "800K"
- "duration": formato corto, ej: "11y 2m", "3y 6m"
- "threat": número entero 0-100
- "since": solo el año, ej: "2014"
- "events": exactamente 5 eventos, time en formato "1h","6h","1d","2d","3d"
- "wikiTitle": título exacto Wikipedia con guiones bajos

Schema exacto:
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

function normalizeFields(conflict) {
  // Sanctions: solo número
  if (conflict.sanctions) {
    const num = conflict.sanctions.replace(/[^0-9]/g, '')
    conflict.sanctions = num || '0'
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

  // Threat: asegurar número entero
  conflict.threat = Math.min(100, Math.max(0, Math.round(Number(conflict.threat) || 50)))

  return conflict
}

async function updateConflict(slug) {
  console.log(`\n🔄 Actualizando conflicto: "${slug}"...\n`)

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY no encontrada en .env.local')
    process.exit(1)
  }

  // 1. Cargar conflicts.json
  const existing = JSON.parse(fs.readFileSync(CONFLICTS_PATH, 'utf-8'))
  const index = existing.findIndex(c => c.slug === slug)

  if (index === -1) {
    console.error(`❌ No existe conflicto con slug: "${slug}"`)
    console.error('\nSlugs disponibles:')
    existing.forEach(c => console.error(`  - ${c.slug}`))
    process.exit(1)
  }

  const current = existing[index]
  console.log(`📋 Conflicto encontrado: ${current.name}`)
  console.log(`   Última data: since=${current.since}, threat=${current.threat}\n`)

  // 2. Generar datos actualizados con Claude
  console.log('🤖 Consultando Claude para datos actualizados...')

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `Actualizá los datos para este conflicto con información al día de hoy (2025):

Nombre: "${current.name}"
Slug actual: "${current.slug}"
ID actual: "${current.id}"
Región: "${current.region}"
Inicio: "${current.since}"
Coordenadas (mantener): lat=${current.lat}, lng=${current.lng}

IMPORTANTE:
- Mantené el mismo "id", "slug", "lat", "lng" y "since" que los actuales
- Actualizá casualties, displaced, sanctions, duration, threat, context, status y events con datos 2025
- Los events deben ser eventos RECIENTES y plausibles de las últimas 72hs
- sanctions debe ser SOLO un número, sin texto`
    }]
  })

  const rawText = message.content[0].text.trim()

  // 3. Parsear
  let updated
  try {
    updated = JSON.parse(rawText)
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/)
    if (!match) {
      console.error('❌ Claude no devolvió JSON válido:\n', rawText)
      process.exit(1)
    }
    try {
      updated = JSON.parse(match[0])
    } catch (e) {
      console.error('❌ Error parseando JSON:', e.message)
      process.exit(1)
    }
  }

  // 4. Forzar campos inmutables del original
  updated.id = current.id
  updated.slug = current.slug
  updated.lat = current.lat
  updated.lng = current.lng
  updated.since = current.since

  // 5. Normalizar formato
  updated = normalizeFields(updated)

  // 6. Verificar Wikipedia
  console.log(`\n🌐 Verificando Wikipedia: "${updated.wikiTitle}"...`)
  const wikiExists = await checkWikiTitle(updated.wikiTitle)

  if (!wikiExists) {
    console.warn(`⚠️  Wikipedia title no verificado: "${updated.wikiTitle}"`)
    console.warn(`   Manteniendo wikiTitle original: "${current.wikiTitle}"`)
    updated.wikiTitle = current.wikiTitle
  } else {
    console.log(`✅ Wikipedia OK\n`)
  }

  // 7. Mostrar diff
  console.log('─'.repeat(50))
  console.log('CAMBIOS DETECTADOS:')
  const fields = ['casualties', 'displaced', 'sanctions', 'duration', 'threat', 'status', 'severity']
  fields.forEach(field => {
    if (current[field] !== updated[field]) {
      console.log(`  ${field}: "${current[field]}" → "${updated[field]}"`)
    }
  })
  console.log('─'.repeat(50))

  // 8. Confirmar
  console.log('\n¿Guardar cambios? (Ctrl+C para cancelar, Enter para confirmar)')
  await new Promise(resolve => process.stdin.once('data', resolve))
  process.stdin.pause()

  // 9. Guardar
  existing[index] = updated
  fs.writeFileSync(CONFLICTS_PATH, JSON.stringify(existing, null, 2))

  console.log(`\n✅ "${current.name}" actualizado correctamente`)
  console.log(`   conflicts.json guardado (${existing.length} conflictos)\n`)
}

// ── Entry point ──
const slug = process.argv[2]

if (!slug) {
  // Sin argumento: actualizar TODOS
  const existing = JSON.parse(fs.readFileSync(CONFLICTS_PATH, 'utf-8'))
  console.log('⚠️  No especificaste un slug. Slugs disponibles:\n')
  existing.forEach(c => console.log(`  node scripts/update-conflict.js "${c.slug}"`))
  console.log('\nPara actualizar todos:\n  node scripts/update-conflict.js --all\n')
  process.exit(0)
}

if (slug === '--all') {
  // Actualizar todos secuencialmente
  const existing = JSON.parse(fs.readFileSync(CONFLICTS_PATH, 'utf-8'))
  console.log(`\n🔄 Actualizando ${existing.length} conflictos...\n`)

  ;(async () => {
    for (const conflict of existing) {
      await updateConflict(conflict.slug)
      // Pausa entre llamadas para no saturar la API
      await new Promise(r => setTimeout(r, 2000))
    }
    console.log('\n✅ Todos los conflictos actualizados.')
  })().catch(err => {
    console.error('❌ Error:', err.message)
    process.exit(1)
  })
} else {
  updateConflict(slug).catch(err => {
    console.error('❌ Error:', err.message)
    process.exit(1)
  })
}