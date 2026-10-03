import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'

describe('AppShell', () => {
  it('renderiza o logo e a tagline da Maná', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppShell />
      </MemoryRouter>,
    )
    expect(screen.getByText('Maná Pizzas')).toBeInTheDocument()
    expect(screen.getByText('Rodízio em casa')).toBeInTheDocument()
  })

  it('renderiza os links de navegação', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppShell />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /editor/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /preview/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /histórico/i })).toBeInTheDocument()
  })

  it('mostra o badge "Salvo" quando showSavedBadge é true', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppShell showSavedBadge />
      </MemoryRouter>,
    )
    expect(screen.getByText('Salvo')).toBeInTheDocument()
  })
})
