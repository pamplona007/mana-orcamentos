import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { OrcamentoProvider, useOrcamento } from '@/hooks/useOrcamento'
import { OrcamentoSummary } from '@/components/OrcamentoSummary'

function Harness({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <OrcamentoProvider>{children}</OrcamentoProvider>
    </MemoryRouter>
  )
}

function PlanoSetter({ id }: { id: 'premium' | 'livre-bebida' | 'livre-sem-bebida' | 'unidade' }) {
  const { setPlano } = useOrcamento()
  return (
    <button type="button" onClick={() => setPlano(id)}>
      set {id}
    </button>
  )
}

function PagamentoSetter() {
  const { setPagamento } = useOrcamento()
  return (
    <button type="button" onClick={() => setPagamento('pix')}>
      set pix
    </button>
  )
}

function ConvidadosSetter() {
  const { setConvidados } = useOrcamento()
  return (
    <button
      type="button"
      onClick={() =>
        setConvidados({ adultos: 25, criancas0a4: 0, criancas5a9: 0 })
      }
    >
      set 25 adultos
    </button>
  )
}

describe('OrcamentoSummary', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('mostra nome do plano e total ao vivo (Premium, 25 adultos, parcelado)', () => {
    render(
      <Harness>
        <ConvidadosSetter />
        <OrcamentoSummary />
      </Harness>,
    )
    expect(screen.getByText('Premium')).toBeInTheDocument()
    const allPessoas = screen.getAllByText('25 pessoas')
    expect(allPessoas.length).toBeGreaterThan(0)
    const all1 = screen.getAllByText((_, el) => el?.textContent?.replace(/\u00a0/g, ' ').includes('2.940,00') ?? false)
    expect(all1.length).toBeGreaterThan(0)
  })

  it('atualiza total quando muda de plano para Livre', () => {
    render(
      <Harness>
        <ConvidadosSetter />
        <PlanoSetter id="livre-bebida" />
        <OrcamentoSummary />
      </Harness>,
    )
    act(() => {
      fireEvent.click(screen.getByText('set livre-bebida'))
    })
    expect(screen.getByText('Rodízio Livre')).toBeInTheDocument()
    const all2 = screen.getAllByText((_, el) => el?.textContent?.replace(/\u00a0/g, ' ').includes('1.650,00') ?? false)
    expect(all2.length).toBeGreaterThan(0)
  })

  it('mostra à vista com 15% off quando pagamento = pix', () => {
    render(
      <Harness>
        <ConvidadosSetter />
        <PagamentoSetter />
        <OrcamentoSummary />
      </Harness>,
    )
    act(() => {
      fireEvent.click(screen.getByText('set pix'))
    })
    expect(screen.getByText(/Total à vista/i)).toBeInTheDocument()
    const all3 = screen.getAllByText((_, el) => el?.textContent?.replace(/\u00a0/g, ' ').includes('2.499,00') ?? false)
    expect(all3.length).toBeGreaterThan(0)
  })

  it('mostra "Recomendado" no Premium', () => {
    render(
      <Harness>
        <OrcamentoSummary />
      </Harness>,
    )
    expect(screen.getByText(/Recomendado/i)).toBeInTheDocument()
  })

  it('mostra parcela 10x e à vista no Pix lado a lado', () => {
    render(
      <Harness>
        <ConvidadosSetter />
        <OrcamentoSummary />
      </Harness>,
    )
    expect(screen.getByText('10x de')).toBeInTheDocument()
    expect(screen.getByText('À vista no Pix')).toBeInTheDocument()
    expect(screen.getByText('no cartão')).toBeInTheDocument()
    expect(screen.getByText(/15% de desconto/)).toBeInTheDocument()
  })
})

describe('useOrcamento reducer', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('alterna entre planos e persiste totais', () => {
    function Testbed() {
      const { state, setPlano, totais } = useOrcamento()
      return (
        <div>
          <div>plano: {state.plano}</div>
          <div>total: {totais.total.toFixed(2)}</div>
          <button type="button" onClick={() => setPlano('unidade')}>unidade</button>
        </div>
      )
    }

    render(
      <Harness>
        <Testbed />
      </Harness>,
    )

    expect(screen.getByText('plano: premium')).toBeInTheDocument()
    expect(screen.getByText('total: 2940.00')).toBeInTheDocument()

    act(() => {
      screen.getByText('unidade').click()
    })

    expect(screen.getByText('plano: unidade')).toBeInTheDocument()
    expect(screen.getByText('total: 1177.50')).toBeInTheDocument()
  })
})
