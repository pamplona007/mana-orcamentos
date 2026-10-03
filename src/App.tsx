import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { Editor } from '@/pages/Editor'
import { Preview } from '@/pages/Preview'
import { History } from '@/pages/History'
import { OrcamentoProvider } from '@/hooks/useOrcamento'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Editor /> },
      { path: 'preview', element: <Preview /> },
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
