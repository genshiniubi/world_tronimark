import { Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { HomePage } from '../features/home/HomePage';
import { TrackPage } from '../features/tracks/TrackPage';
import { ProblemsPage } from '../features/problems/ProblemsPage';
import { WorkspacePage } from '../features/workspace/WorkspacePage';
import { NotesPage } from '../features/notes/NotesPage';
import { ProgressPage } from '../features/progress/ProgressPage';
import { SitePage } from '../features/site/SitePage';
import { NotFoundPage } from './NotFoundPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="tracks/:trackId" element={<TrackPage />} />
        <Route path="problems" element={<ProblemsPage />} />
        <Route path="problems/:problemId" element={<WorkspacePage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="about" element={<SitePage slug="about" />} />
        <Route path="contact" element={<SitePage slug="contact" />} />
        <Route path="sponsor" element={<SitePage slug="sponsor" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
