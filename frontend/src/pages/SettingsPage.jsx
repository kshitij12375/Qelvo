import React from 'react'
import { useThemeStore } from '../store/useThemeStore'
import "../ui/SettingsPage.css"

const themes = [
  { name: 'Cupcake', value: 'cupcake' },
  { name: 'Light', value: 'light' },
  { name: 'Dark', value: 'dark' },
  { name: 'Synthwave', value: 'synthwave' },
  { name: 'Retro', value: 'retro' },
  { name: 'Forest', value: 'forest' },
]

const SettingsPage = () => {

  const { theme, setTheme } = useThemeStore();

  return (
    <main className="settings-page">
      <section className="settings-content">
        <h1>Choose a theme</h1>
        <p className="settings-description">
          Pick a look for your chat interface.
        </p>

        <div className="theme-list">
          {themes.map((item) => (
            <button
              key={item.value}
              type="button"
              data-theme={item.value}
              aria-pressed={theme === item.value}
              onClick={() => setTheme(item.value)}
              className={`theme-card${theme === item.value ? ' selected' : ''}`}
            >
              <div className="theme-card-content">
                <span className="theme-name">{item.name}</span>
                <div className="theme-colors">
                  <span className="theme-color primary-color" />
                  <span className="theme-color secondary-color" />
                  <span className="theme-color accent-color" />
                </div>

              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

export default SettingsPage
