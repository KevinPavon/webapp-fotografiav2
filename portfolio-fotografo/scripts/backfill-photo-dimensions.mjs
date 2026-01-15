import 'dotenv/config'
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

async function getImageSize(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Fetch failed ${res.status} ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const meta = await sharp(buf).metadata()
  if (!meta.width || !meta.height) throw new Error(`No width/height for ${url}`)
  return { width: meta.width, height: meta.height }
}

async function run() {
  const pageSize = 200
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from('fotos')
      .select('id,url,width,height')
      .order('created_at', { ascending: false })
      .range(from, from + pageSize - 1)

    if (error) throw error
    if (!data || data.length === 0) break

    for (const f of data) {
      if (!f.url) continue
      if (f.width && f.height) continue

      try {
        const { width, height } = await getImageSize(f.url)
        const { error: upErr } = await supabase
          .from('fotos')
          .update({ width, height })
          .eq('id', f.id)

        if (upErr) throw upErr
        console.log('OK', f.id, width, height)
      } catch (e) {
        console.log('FAIL', f.id, String(e?.message || e))
      }
    }

    from += pageSize
  }

  console.log('Backfill terminado.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
