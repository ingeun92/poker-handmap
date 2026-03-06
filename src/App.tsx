import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { HandMapPage } from '@/pages/HandMapPage'
import { SpacedRepetitionPage } from '@/pages/SpacedRepetitionPage'
import { SpeedQuizPage } from '@/pages/SpeedQuizPage'
import { DashboardPage } from '@/pages/DashboardPage'

import { GridFillPage } from '@/pages/GridFillPage'
import { HandComparePage } from '@/pages/HandComparePage'
import { CategorySortPage } from '@/pages/CategorySortPage'
import { OpenRangePage } from '@/pages/OpenRangePage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/handmap" element={<HandMapPage />} />
          <Route path="/grid-fill" element={<GridFillPage />} />
          <Route path="/hand-compare" element={<HandComparePage />} />
          <Route path="/category-sort" element={<CategorySortPage />} />
          <Route path="/open-range" element={<OpenRangePage />} />
          <Route path="/spaced-repetition" element={<SpacedRepetitionPage />} />
          <Route path="/speed-quiz" element={<SpeedQuizPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
