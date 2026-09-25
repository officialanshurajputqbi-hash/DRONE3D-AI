import React, { useState, useCallback } from 'react';
import { Sidebar, AppPageId } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { LandingPage } from './components/pages/LandingPage';
import { AuthPage } from './components/pages/AuthPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { NewProjectPage } from './components/pages/NewProjectPage';
import { VideoUploadPage } from './components/pages/VideoUploadPage';
import { FlightDataUploadPage } from './components/pages/FlightDataUploadPage';
import { PipelinePage } from './components/pages/PipelinePage';
import { Viewer3D } from './components/3d/Viewer3D';
import { PointCloudViewer } from './components/3d/PointCloudViewer';
import { GISMap } from './components/gis/GISMap';
import { AIAnalysisPage } from './components/pages/AIAnalysisPage';
import { MeasurementsPage } from './components/pages/MeasurementsPage';
import { QualityPage } from './components/pages/QualityPage';
import { DisasterPage } from './components/pages/DisasterPage';
import { InspectionPage } from './components/pages/InspectionPage';
import { DigitalTwinPage } from './components/pages/DigitalTwinPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { ExportCenterPage } from './components/pages/ExportCenterPage';
import { ProjectHistoryPage } from './components/pages/ProjectHistoryPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { HelpDocsPage } from './components/pages/HelpDocsPage';
import { useStore } from './store/useStore';
import { DEFAULT_DEMO_PROJECT } from './data/mockData';

type MainView = 'landing' | 'auth' | 'app';

export default function App() {
  const { user, setActiveProject, resetToDefaultDemo } = useStore();

  const [mainView, setMainView] = useState<MainView>('landing');
  const [currentPage, setCurrentPage] = useState<AppPageId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Quick Grand Finale live demo launcher
  const handleOpenLiveDemo = useCallback(() => {
    resetToDefaultDemo();
    setActiveProject(DEFAULT_DEMO_PROJECT.id);
    setMainView('app');
    setCurrentPage('viewer3d');
    addToast('success', 'Jaipur Heritage Survey Live Demo Loaded', 'Full 3D model, GIS trajectory, and metric measurements ready.');
  }, [resetToDefaultDemo, setActiveProject, addToast]);

  const handleStartProject = () => {
    setMainView('app');
    setCurrentPage('new-project');
  };

  const handleGoToAuth = () => {
    setMainView('auth');
  };

  const handleAuthSuccess = () => {
    setMainView('app');
    setCurrentPage('dashboard');
    addToast('success', 'Authenticated Successfully', 'Welcome to DRONE3D AI Command Center.');
  };

  const handleNavigate = (page: AppPageId) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-slate-100 flex flex-col font-sans">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {mainView === 'landing' && (
        <LandingPage
          onStartProject={handleStartProject}
          onExploreDemo={handleOpenLiveDemo}
          onGoToAuth={handleGoToAuth}
        />
      )}

      {mainView === 'auth' && (
        <AuthPage
          onSuccess={handleAuthSuccess}
          onBackToLanding={() => setMainView('landing')}
        />
      )}

      {mainView === 'app' && (
        <div className="flex h-screen w-screen overflow-hidden bg-[#07111F]">
          {/* Main Sidebar */}
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* App Body Column */}
          <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
            {/* Top Bar */}
            <TopBar
              onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
              onNavigate={handleNavigate}
              onOpenLiveDemo={handleOpenLiveDemo}
            />

            {/* Dynamic Page Content */}
            <main className="flex-1 overflow-y-auto bg-[#07111F]">
              {currentPage === 'dashboard' && (
                <DashboardPage
                  onNavigate={handleNavigate}
                  onOpenLiveDemo={handleOpenLiveDemo}
                />
              )}

              {currentPage === 'projects' && (
                <ProjectHistoryPage onOpenProject={handleNavigate} />
              )}

              {currentPage === 'new-project' && (
                <NewProjectPage onProjectCreated={handleNavigate} />
              )}

              {currentPage === 'upload-video' && (
                <VideoUploadPage
                  onProceedToPipeline={() => handleNavigate('pipeline')}
                  onProceedToFlightData={() => handleNavigate('upload-flight')}
                />
              )}

              {currentPage === 'upload-flight' && (
                <FlightDataUploadPage
                  onProceedToPipeline={() => handleNavigate('pipeline')}
                />
              )}

              {currentPage === 'pipeline' && (
                <PipelinePage
                  onNavigateToViewer={() => handleNavigate('viewer3d')}
                />
              )}

              {currentPage === 'viewer3d' && (
                <Viewer3D
                  initialMode="textured"
                  onAddMeasurement={(label, val, unit) => {
                    addToast('info', `Recorded ${label}`, `${val} ${unit} added to measurement registry.`);
                  }}
                />
              )}

              {currentPage === 'pointcloud' && <PointCloudViewer />}

              {currentPage === 'gis' && <GISMap />}

              {currentPage === 'ai-analysis' && <AIAnalysisPage />}

              {currentPage === 'measurements' && (
                <MeasurementsPage onNavigateTo3D={() => handleNavigate('viewer3d')} />
              )}

              {currentPage === 'quality' && <QualityPage />}

              {currentPage === 'disaster' && <DisasterPage />}

              {currentPage === 'inspection' && (
                <InspectionPage onGenerateReport={() => handleNavigate('reports')} />
              )}

              {currentPage === 'digital-twin' && <DigitalTwinPage />}

              {currentPage === 'analytics' && <AnalyticsPage />}

              {currentPage === 'reports' && <ReportsPage />}

              {currentPage === 'export' && <ExportCenterPage />}

              {currentPage === 'history' && (
                <ProjectHistoryPage onOpenProject={handleNavigate} />
              )}

              {currentPage === 'settings' && <SettingsPage />}

              {currentPage === 'help' && <HelpDocsPage />}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
