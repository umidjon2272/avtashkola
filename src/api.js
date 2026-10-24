// Frontend-only demo adapter. No network, real login or persistent server.
// ALL data is isolated to this origin + browser's localStorage.
import { demoData, normalizeData } from './data.js'

export const SESSION_KEY = 'autoschool-demo-session-v1'
const STORAGE_KEY = 'autoschool-demo-state-v1'
export const getToken = () => sessionStorage.getItem(SESSION_KEY)
export const setToken = token => token ? sessionStorage.setItem(SESSION_KEY, token) : sessionStorage.removeItem(SESSION_KEY)
const json = (body, status=200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json' }
})
const authorized = () => getToken() === 'demo-session'
const readState = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return {revision:0, data:demoData()}
  try {
    const record = JSON.parse(raw)
    if (!record || typeof record !== 'object' || !Number.isSafeInteger(record.revision)) throw Error('Invalid state')
    return {revision:record.revision, data:normalizeData(record.data)}
  } catch { throw Error('Demo maʼlumotlarini o‘qib bo‘lmadi. Brauzer maʼlumotini tekshiring.') }
}
export async function apiFetch(path, init={}) {
  try {
    const method = (init.method || 'GET').toUpperCase()
    // Important: this is NOT a secure password. Public demo client JS is readable by anyone.
    if (path === '/api/auth/login' && method === 'POST') {
      const {username,password} = JSON.parse(init.body || '{}')
      if (username === 'admin' && password === 'Admin12345!') return json({ok:true,token:'demo-session'})
      return json({error:'Login yoki parol noto‘g‘ri'},401)
    }
    if (path === '/api/auth/me' && method === 'GET') return authorized() ? json({ok:true,user:{username:'admin',role:'admin'}}) : json({error:'Sessiya tugagan'},401)
    if (!authorized()) {
      setToken(null)
      window.dispatchEvent(new Event('autoschool:session-expired'))
      return json({error:'Qayta kiring'},401)
    }
    if (path === '/api/state' && method === 'GET') return json({ok:true,...readState()})
    if (path === '/api/state' && method === 'PUT') {
      const {data,revision} = JSON.parse(init.body || '{}')
      const current = readState()
      if (revision !== current.revision) return json({error:'Demo maʼlumotlar boshqa oynada yangilangan. Sahifani qayta yuklang.'},409)
      if (!data || !Array.isArray(data.students) || !Array.isArray(data.groups) || !Array.isArray(data.payments)) return json({error:'Maʼlumot formati noto‘g‘ri'},400)
      const next = {revision: current.revision + 1, data: normalizeData(data)}
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return json({ok:true,revision:next.revision})
    }
    return json({error:'Demo APIʼda bunday amal yo‘q'},404)
  } catch (error) {
    return json({error: error instanceof Error ? error.message : 'Demo maʼlumotlari xatosi'},500)
  }
}
