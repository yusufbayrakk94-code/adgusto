import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './global.css';
import { auth } from './config/firebase';
import { useAuth } from './hooks/useAuth';
import { LanguageContext, useLanguageState } from './hooks/useLanguage';
import { getTranslation, translations } from './i18n/translations';
import { AuthForm } from './components/AuthForm';
import { EmailVerification } from './components/EmailVerification';
import { PasswordReset } from './components/PasswordReset';
import { Onboarding } from './components/Onboarding';
import { Sidebar } from './components/Sidebar';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './config/firebase';
import { applyActionCode, checkActionCode } from 'firebase/auth';
import { LandingPage } from './components/LandingPage';
import { MarketingAnalysis } from './components/MarketingAnalysis';
import MarketingImageGenerator from './components/MarketingImageGenerator';
import { MarketingVideoGenerator } from './components/MarketingVideoGenerator';
import { AnalysisResults } from './components/AnalysisResults';
import { ProfilePage } from './components/ProfilePage';
import { AboutPage } from './components/AboutPage';
import { BlogPage } from './components/BlogPage';
import { ContactPage } from './components/ContactPage';
import { FeaturesPage } from './components/FeaturesPage';
import { DocumentationPage } from './components/DocumentationPage';
import { PrivacyPage } from './components/PrivacyPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsPage } from './components/TermsPage';
import { PricingPage } from './components/PricingPage';
import { AdminPanel } from './components/AdminPanel';
import { CSVAnalyzer } from './components/CSVAnalyzer';
import { CampaignAnalyzerComponent } from './components/CampaignAnalyzer';
import { ErrorMessage } from './components/ErrorMessage';
import { useGroqAnalysis } from './hooks/useGroqAnalysis';
import { StorageService } from './services/storageService';
import { FirestoreService } from './services/firestoreService';
import { SubscriptionService, Subscription } from './services/subscriptionService';

import { AdCopyGenerator } from './components/AdCopyGenerator';
import AdImageAnalyzer from './components/AdImageAnalyzer';
import { GoogleAdsConnect } from './components/GoogleAdsConnect';
import MetaAdsLibrary from './components/MetaAdsLibrary';
import InternalGoogleAdsDashboard from './components/InternalGoogleAdsDashboard';
import InternalAccessTest from './components/InternalAccessTest';
import { MetaAdsManager } from './components/MetaAdsManager';

import { Sparkles, FileText, ChartBar as BarChart3, Image as ImageIcon, Eye, ChartLine as LineChart, Video } from 'lucide-react';

function AppContent() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const { analysis, loading: analysisLoading, error: analysisError, analyzeService, clearAnalysis } = useGroqAnalysis();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguageState();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [userStats, setUserStats] = useState({
    totalAdCopies: 0,
    totalMarketingAnalyses: 0,
    totalCSVAnalyses: 0,
    totalImageGenerations: 0,
    totalImageAnalyses: 0,
    recentActivity: [] as any[]
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const onboardingChecked = useRef(false);

  const routes = translations[language].routes;

  const languageContextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: string) => getTranslation(language, key)
    }),
    [language, setLanguage]
  );

  useEffect(() => {
    const handleEmailVerification = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      const oobCode = urlParams.get('oobCode');

      if (mode === 'resetPassword' && oobCode) {
        setResetCode(oobCode);
        setShowPasswordReset(true);
        setCheckingOnboarding(false);
        return;
      }

      if ((mode === 'verifyEmail' || mode === 'action') && oobCode) {
        try {
          const info = await checkActionCode(auth, oobCode);

          if (info.operation === 'VERIFY_EMAIL') {
            await applyActionCode(auth, oobCode);

            if (auth.currentUser) {
              await auth.currentUser.reload();

              const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
              const userData = userDoc.data();

              window.history.replaceState({}, document.title, '/');

              if (!userData || !userData.onboardingCompleted) {
                setNeedsOnboarding(true);
                setCheckingOnboarding(false);
              } else {
                setNeedsOnboarding(false);
                setCheckingOnboarding(false);
                navigate(`/${routes.dashboard}`, { replace: true });
              }
            }
          }
        } catch (error) {
          console.error('Error verifying email:', error);
          window.history.replaceState({}, document.title, '/');
        }
      }
    };

    handleEmailVerification();
  }, [navigate, routes.dashboard]);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user && !onboardingChecked.current) {
        onboardingChecked.current = true;
        await user.reload();

        const providerData = user.providerData || [];
        const isGoogleUser = providerData.some(provider => provider.providerId === 'google.com');

        if (user.emailVerified || isGoogleUser) {
          try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();

            if (isGoogleUser && !userData) {
              await setDoc(userDocRef, {
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                onboardingCompleted: true,
                createdAt: new Date().toISOString(),
                provider: 'google'
              });

              setNeedsOnboarding(false);
              setCheckingOnboarding(false);
              return;
            }

            if (!userData || !userData.onboardingCompleted) {
              setNeedsOnboarding(true);
              setCheckingOnboarding(false);
              return;
            }

            setNeedsOnboarding(false);
            setCheckingOnboarding(false);
          } catch (error) {
            console.error('Error checking onboarding status:', error);
            setCheckingOnboarding(false);
          }
        } else {
          setCheckingOnboarding(false);
        }
      } else if (!user) {
        onboardingChecked.current = false;
        setCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [user?.uid, navigate, routes.dashboard]);

  const loadUserStats = useCallback(async () => {
    if (user) {
      try {
        const stats = await FirestoreService.getUserStats(user.uid);
        setUserStats(stats);

        const subscriptionData = await SubscriptionService.getUserSubscription(user.uid);
        setSubscription(subscriptionData);
      } catch (error) {
        console.error('Error loading user stats:', error);
      }
    } else {
      setUserStats({ totalAdCopies: 0, totalMarketingAnalyses: 0, totalCSVAnalyses: 0, totalImageGenerations: 0, totalImageAnalyses: 0, recentActivity: [] });
      setSubscription(null);
    }
  }, [user]);

  useEffect(() => {
    loadUserStats();
  }, [loadUserStats]);

  const handleAnalyze = useCallback(async (service: string, sector?: string) => {
    try {
      const result = await analyzeService(service, sector);

      if (user && result) {
        StorageService.saveAnalysis(user.uid, result);
      }

      if (user && result) {
        // Save to Firestore in background without blocking UI
        FirestoreService.saveMarketingAnalysis(user.uid, service, result)
          .then(() => FirestoreService.getUserStats(user.uid))
          .then((stats) => setUserStats(stats))
          .catch((error) => console.error('Error saving to Firestore:', error));
      }

      return result;
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  }, [analyzeService, user]);

  const handleNavigateToDashboard = useCallback(() => {
    navigate(`/${routes.dashboard}`);
  }, [navigate, routes.dashboard]);

  const handleNavigateToImageGenerator = useCallback((campaignData: any) => {
    sessionStorage.setItem('campaignData', JSON.stringify(campaignData));
    navigate(`/${routes.imageGenerator}`);
  }, [navigate, routes.imageGenerator]);

  const handleAuth = async (email: string, password: string, isSignUp: boolean) => {
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = useCallback(async () => {
    await signOut();
    clearAnalysis();
    navigate('/');
  }, [signOut, clearAnalysis, navigate]);

  return (
    <LanguageContext.Provider value={languageContextValue}>
      {showPasswordReset ? (
        <PasswordReset
          oobCode={resetCode}
          onBack={() => {
            setShowPasswordReset(false);
            setResetCode('');
            window.history.replaceState({}, document.title, '/');
            navigate('/');
          }}
        />
      ) : loading || checkingOnboarding ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-dark animate-pulse" />
            </div>
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-dark">{getTranslation(language, 'loading')}</p>
          </div>
        </div>
      ) : analysisError ? (
        <ErrorMessage
          message={analysisError}
          onRetry={() => window.location.reload()}
        />
      ) : user && !user.emailVerified && !user.providerData?.some(provider => provider.providerId === 'google.com') ? (
        <EmailVerification
          userEmail={user.email || ''}
          onVerified={async () => {
            await user.reload();
            if (user.emailVerified) {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              const userData = userDoc.data();

              if (!userData || !userData.onboardingCompleted) {
                setNeedsOnboarding(true);
                setCheckingOnboarding(false);
              } else {
                setNeedsOnboarding(false);
                setCheckingOnboarding(false);
              }
            }
          }}
          onLogout={handleLogout}
        />
      ) : user && needsOnboarding && (user.emailVerified || user.providerData?.some(provider => provider.providerId === 'google.com')) ? (
        <Onboarding
          userId={user.uid}
          userEmail={user.email || ''}
          onComplete={() => {
            setNeedsOnboarding(false);
            navigate(`/${routes.dashboard}`);
          }}
        />
      ) : (
        <RoutesContent />
      )}
    </LanguageContext.Provider>
  );

  function ProtectedRoute({ children }: { children: React.ReactNode }) {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }

  function renderPageWithSidebar(content: React.ReactNode) {
    const { t } = languageContextValue;

    return (
      <div className="flex min-h-screen bg-slate-50 text-slate-950">
        <Sidebar
          currentPage={location.pathname.substring(1) || routes.dashboard}
          onNavigate={(page: string) => {
            navigate(`/${page}`);
            setSidebarOpen(false);
          }}
          onLogout={handleLogout}
          userEmail={user?.email || undefined}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className="flex-1 overflow-auto">
          <div className="relative">
            <div className="mx-auto max-w-7xl p-6 lg:p-10">
              {content}
            </div>
            <a
              href="https://calendly.com/adgustoapp"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primaryDark"
            >
              {t('common.demoSchedule')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  function DashboardHome() {
    const { t } = languageContextValue;

    return (
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <section className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-soft">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Dashboard</p>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                  {t('dashboard.welcomeTitle')}
                </h1>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  {t('dashboard.welcomeDescription') || 'Tüm pazarlama araçlarını tek bir panelde takip edin ve hızlıca erişin.'}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-6 shadow-sm border border-slate-200">
                  <p className="text-sm text-slate-500">Aktif Araçlar</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">8</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-6 shadow-sm border border-slate-200">
                  <p className="text-sm text-slate-500">Hızlı Erişim</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">Tek sayfa</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <button
              onClick={() => navigate(`/${routes.marketingAnalysis}`)}
              className="group rounded-[28px] border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{t('dashboard.marketingAnalysis.title')}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{t('dashboard.marketingAnalysis.description')}</p>
            </button>

            <button
              onClick={() => navigate(`/${routes.adCopy}`)}
              className="group rounded-[28px] border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{t('dashboard.adCopy.title')}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{t('dashboard.adCopy.description')}</p>
            </button>

            <button
              onClick={() => navigate(`/${routes.campaignAnalyzer}`)}
              className="group rounded-[28px] border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{t('dashboard.campaignAnalyzer.title')}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{t('dashboard.campaignAnalyzer.description')}</p>
            </button>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <button
              onClick={() => navigate(`/${routes.imageGenerator}`)}
              className="group rounded-[28px] border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <ImageIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{t('dashboard.imageGenerator.title')}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{t('dashboard.imageGenerator.description')}</p>
            </button>

            <button
              onClick={() => navigate(`/${routes.imageAnalyzer}`)}
              className="group rounded-[28px] border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{t('dashboard.imageAnalyzer.title')}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{t('dashboard.imageAnalyzer.description')}</p>
            </button>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-left shadow-sm opacity-80">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
                <LineChart className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{t('dashboard.adManagement.title')}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{t('dashboard.adManagement.description')}</p>
              <span className="mt-6 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{t('dashboard.comingSoon')}</span>
            </div>
          </section>
        </div>
      </div>
    );
  }

  function RoutesContent() {
    return (
      <Routes>
        <Route path="/" element={
          user ? <Navigate to={`/${routes.dashboard}`} replace /> :
          <LandingPage
            onLogin={() => navigate(`/${routes.auth}?mode=signin`)}
            onSignup={() => navigate(`/${routes.auth}?mode=signup`)}
            onShowPage={(page) => navigate(`/${page}`)}
          />
        } />

        <Route path={`/${routes.auth}`} element={
          user ? <Navigate to={`/${routes.dashboard}`} replace /> :
          <AuthForm
            onSignIn={(email, password) => handleAuth(email, password, false)}
            onSignUp={(email, password) => handleAuth(email, password, true)}
            onBack={() => navigate('/')}
            isSignUp={new URLSearchParams(location.search).get('mode') === 'signup'}
          />
        } />

        <Route path={`/${routes.about}`} element={<AboutPage onShowPage={(page) => navigate(`/${page}`)} />} />
        <Route path={`/${routes.blog}`} element={<BlogPage onGoHome={() => navigate('/')} onShowPage={(page) => navigate(`/${page}`)} />} />
        <Route path={`/${routes.contact}`} element={<ContactPage onShowPage={(page) => navigate(`/${page}`)} />} />
        <Route path={`/${routes.features}`} element={<FeaturesPage onShowPage={(page) => navigate(`/${page}`)} />} />
        <Route path={`/${routes.documentation}`} element={<DocumentationPage onShowPage={(page) => navigate(`/${page}`)} />} />
        <Route path={`/${routes.privacy}`} element={<PrivacyPage onShowPage={(page) => navigate(`/${page}`)} />} />
        <Route path={`/${routes.privacyPolicy}`} element={<PrivacyPolicyPage onShowPage={(page) => navigate(`/${page}`)} />} />
        <Route path={`/${routes.terms}`} element={<TermsPage onShowPage={(page) => navigate(`/${page}`)} />} />
        <Route path={`/${routes.pricing}`} element={<PricingPage onGoHome={() => navigate('/')} onShowPage={(page) => navigate(`/${page}`)} />} />

        <Route path={`/${routes.dashboard}`} element={
          <ProtectedRoute>
            {renderPageWithSidebar(<DashboardHome />)}
          </ProtectedRoute>
        } />

        <Route path={`/${routes.googleAds}`} element={
          <ProtectedRoute>
            {renderPageWithSidebar(<GoogleAdsConnect userId={user?.uid || ''} onRefreshStats={loadUserStats} />)}
          </ProtectedRoute>
        } />

        <Route path={`/${routes.internalGoogleAds}`} element={
          <ProtectedRoute>
            <InternalGoogleAdsDashboard />
          </ProtectedRoute>
        } />

        <Route path={`/${routes.internalAccessTest}`} element={
          <ProtectedRoute>
            <InternalAccessTest />
          </ProtectedRoute>
        } />

        <Route path={`/${routes.marketingAnalysis}`} element={
          <ProtectedRoute>
            {renderPageWithSidebar(
              <MarketingAnalysis
                onAnalyze={handleAnalyze}
                loading={analysisLoading}
                onBack={handleNavigateToDashboard}
                onLogout={handleLogout}
                userEmail={user?.email || undefined}
                onGoHome={handleNavigateToDashboard}
                onNavigateToImageGenerator={handleNavigateToImageGenerator}
                onResultReady={() => navigate(`/${routes.analysisResults}`)}
              />
            )}
          </ProtectedRoute>
        } />

        <Route path={`/${routes.imageGenerator}`} element={
          <ProtectedRoute>
            {renderPageWithSidebar(<MarketingImageGenerator onRefreshStats={loadUserStats} />)}
          </ProtectedRoute>
        } />

        <Route path={`/${routes.imageAnalyzer}`} element={
          <ProtectedRoute>
            {renderPageWithSidebar(<AdImageAnalyzer onRefreshStats={loadUserStats} />)}
          </ProtectedRoute>
        } />

        <Route path={`/${routes.metaAds}`} element={
          <ProtectedRoute>
            {renderPageWithSidebar(<MetaAdsLibrary />)}
          </ProtectedRoute>
        } />

        <Route path="/meta-ads-manager" element={
          <ProtectedRoute>
            {renderPageWithSidebar(<MetaAdsManager user={user} />)}
          </ProtectedRoute>
        } />

        <Route path="/meta-ads-callback" element={
          <ProtectedRoute>
            {renderPageWithSidebar(<MetaAdsManager user={user} />)}
          </ProtectedRoute>
        } />

        <Route path={`/${routes.adCopy}`} element={
          <ProtectedRoute>
            {renderPageWithSidebar(
              <AdCopyGenerator
                onLogout={handleLogout}
                onRefreshStats={loadUserStats}
              />
            )}
          </ProtectedRoute>
        } />

        <Route path={`/${routes.videoGenerator}`} element={
          <ProtectedRoute>
            {renderPageWithSidebar(<MarketingVideoGenerator />)}
          </ProtectedRoute>
        } />

        <Route path="/csv-analyzer" element={
          <ProtectedRoute>
            {renderPageWithSidebar(
              <CSVAnalyzer
                onBack={() => navigate(`/${routes.dashboard}`)}
                onLogout={handleLogout}
                userEmail={user?.email || undefined}
                onRefreshStats={loadUserStats}
              />
            )}
          </ProtectedRoute>
        } />

        <Route path={`/${routes.campaignAnalyzer}`} element={
          <ProtectedRoute>
            {renderPageWithSidebar(
              <CampaignAnalyzerComponent
                user={user}
                userEmail={user?.email || undefined}
                onLogout={handleLogout}
                onBack={() => navigate(`/${routes.dashboard}`)}
                onGoHome={() => navigate(`/${routes.dashboard}`)}
              />
            )}
          </ProtectedRoute>
        } />

        <Route path={`/${routes.analysisResults}`} element={
          <ProtectedRoute>
            {analysis ? renderPageWithSidebar(
              <AnalysisResults
                analysis={analysis}
                onBack={() => navigate(`/${routes.dashboard}`)}
                onLogout={handleLogout}
                userEmail={user?.email || undefined}
                onGoHome={() => navigate(`/${routes.dashboard}`)}
              />
            ) : <Navigate to={`/${routes.dashboard}`} replace />}
          </ProtectedRoute>
        } />

        <Route path={`/${routes.profile}`} element={
          <ProtectedRoute>
            {renderPageWithSidebar(
              <ProfilePage
                onBack={() => navigate(`/${routes.dashboard}`)}
                onLogout={handleLogout}
                onViewAnalysis={(analysis) => {
                  console.log('Viewing analysis from profile:', analysis);
                  navigate(`/${routes.analysisResults}`);
                }}
                userEmail={user?.email || undefined}
                userId={user?.uid || ''}
                userStats={userStats}
                onRefresh={loadUserStats}
              />
            )}
          </ProtectedRoute>
        } />

        <Route path={`/${routes.admin}`} element={
          <ProtectedRoute>
            {renderPageWithSidebar(
              <AdminPanel
                onGoHome={() => navigate(`/${routes.dashboard}`)}
                onLogout={handleLogout}
                userEmail={user?.email || undefined}
              />
            )}
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
