import { browser } from '$app/environment'
import { init, register } from 'svelte-i18n'

const defaultLocale = 'en'

register('en', () => import('./locales/en.json'))
register('fr', () => import('./locales/fr.json'))
register('es', () => import('./locales/es.json'))
register('it', () => import('./locales/it.json'))

init({
    fallbackLocale: defaultLocale,
    initialLocale: (browser ? window?.navigator?.language : defaultLocale) || defaultLocale,
})