import defaultConfig from '../config/content.json'

export const getConfig = () => {
  const savedConfig = localStorage.getItem('siteConfig')
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig)
    } catch (e) {
      console.error('Error parsing saved config:', e)
      return defaultConfig
    }
  }
  return defaultConfig
}

export const saveConfig = (config) => {
  localStorage.setItem('siteConfig', JSON.stringify(config))
}

export const resetConfig = () => {
  localStorage.removeItem('siteConfig')
  return defaultConfig
}
