import { describe, it, expect, beforeEach } from 'vitest'
import i18n from './index'

describe('i18n configuration', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('defaults to English fallback and translates common namespace', () => {
    expect(i18n.t('save', { ns: 'common' })).toBe('Save')
    expect(i18n.t('cancel', { ns: 'common' })).toBe('Cancel')
  })

  it('translates nav namespace in English', () => {
    expect(i18n.t('home', { ns: 'nav' })).toBe('Home')
    expect(i18n.t('workouts', { ns: 'nav' })).toBe('Workouts')
    expect(i18n.t('settings', { ns: 'nav' })).toBe('Settings')
  })

  it('switches to pt-BR and provides correct translations', async () => {
    await i18n.changeLanguage('pt-BR')

    expect(i18n.t('save', { ns: 'common' })).toBe('Salvar')
    expect(i18n.t('home', { ns: 'nav' })).toBe('Início')
    expect(i18n.t('workouts', { ns: 'nav' })).toBe('Treinos')
    expect(i18n.t('settings', { ns: 'nav' })).toBe('Ajustes')
  })
})
