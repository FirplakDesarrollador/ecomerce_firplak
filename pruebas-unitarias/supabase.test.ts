import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient as createBrowserClient } from '../lib/supabase/client'
import { createClient as createServerClient } from '../lib/supabase/server'
import * as ssr from '@supabase/ssr'

// Mock de @supabase/ssr para no hacer llamadas reales en los tests unitarios
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(),
  createServerClient: vi.fn()
}))

// Mock de next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: vi.fn().mockReturnValue([]),
    set: vi.fn()
  })
}))

describe('Supabase Client Setup', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://test.url'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  it('debería tener variables de entorno definidas', () => {
    // Estas variables provienen de process.env durante la ejecución
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined()
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined()
  })

  it('debería inicializar el cliente de navegador correctamente', () => {
    createBrowserClient()
    expect(ssr.createBrowserClient).toHaveBeenCalledWith(
      'http://test.url',
      'test-anon-key'
    )
  })

  it('debería inicializar el cliente de servidor correctamente', async () => {
    await createServerClient()
    expect(ssr.createServerClient).toHaveBeenCalledWith(
      'http://test.url',
      'test-anon-key',
      expect.any(Object)
    )
  })
})
