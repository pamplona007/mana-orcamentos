import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { Editor } from '@/pages/Editor'
import { History } from '@/pages/History'
import { OrcamentoProvider } from '@/hooks/useOrcamento'

const Preview = lazy(() =>
  import('@/pages/Preview').then((m) => ({ default: m.Preview })),
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Editor /> },
      {
        path: 'preview',
        element: (
          <Suspense fallback={<div style={{ padding: 'var(--space-7)', color: 'var(--cream-dim)' }}>Carregando preview…</div>}>
            <Preview />
          </Suspense>
        ),
      },
      { path: 'history', element: <History /> },
    ],
  },
])

export function App() {
  return (
    <OrcamentoProvider>
      <RouterProvider router={router} />
    </OrcamentoProvider>
  )
}
