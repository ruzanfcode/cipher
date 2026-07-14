import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Layout/Header';
import { AddToCollectionModal, AiChatOverlay, ConfirmDialog, EvidenceDrawer, ShareAccessModal } from './components/UI/Modals';
import { useCipherApp } from './hooks/useCipherApp';

const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));
const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));

function App() {
  const app = useCipherApp();

  return (
    <div className="app-shell" id="top">
      <Header app={app} />
      <Suspense fallback={<main className="page">Loading...</main>}>
        {!app.loggedIn ? (
          <LoginPage app={app} />
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/discover" replace />} />
            <Route path="/discover" element={<DiscoverPage app={app} />} />
            <Route path="/results" element={<ResultsPage app={app} />} />
            <Route path="/analysis/:productId" element={<AnalysisPage app={app} />} />
            <Route path="/collections" element={<CollectionsPage app={app} />} />
            <Route path="/collections/:collectionId" element={<CollectionDetailPage app={app} />} />
            <Route path="/collections/:collectionId/compare" element={<ComparePage app={app} />} />
            <Route path="*" element={<Navigate to="/discover" replace />} />
          </Routes>
        )}
        {app.showAnalysis && app.analysisIsOverlay ? <AnalysisPage app={app} overlay /> : null}
        <AddToCollectionModal app={app} />
        <ShareAccessModal app={app} />
        <ConfirmDialog app={app} />
        <EvidenceDrawer app={app} />
        <AiChatOverlay app={app} />
      </Suspense>
    </div>
  );
}

export default App;
