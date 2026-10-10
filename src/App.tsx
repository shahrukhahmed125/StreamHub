import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

// Layouts
import { AppLayout } from './layouts/AppLayout';
import { StudioLayout } from './layouts/StudioLayout';
import { AuthLayout } from './layouts/AuthLayout';

// OTT Core Pages
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { TVShowsPage } from './pages/TVShowsPage';
import { NewAndPopularPage } from './pages/NewAndPopularPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { SeriesDetailsPage } from './pages/SeriesDetailsPage';
import { WatchPage } from './pages/WatchPage';
import { ContinueWatchingPage } from './pages/ContinueWatchingPage';
import { MyListPage } from './pages/MyListPage';
import { SearchPage } from './pages/SearchPage';
import { GenreDetailsPage } from './pages/GenreDetailsPage';
import { CountryPage } from './pages/CountryPage';

// Creator Ecosystem Pages
import { CreatorsPage } from './pages/CreatorsPage';
import { CreatorProfilePage } from './pages/CreatorProfilePage';
import { ChannelPage } from './pages/ChannelPage';
import { ShortsPage } from './pages/ShortsPage';
import { CategoryPage } from './pages/CategoryPage';
import { PlaylistPage } from './pages/PlaylistPage';
import { ExplorePage } from './pages/ExplorePage';
import { TrendingPage } from './pages/TrendingPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';

// Library Pages
import { LibraryPage } from './pages/LibraryPage';
import { HistoryPage } from './pages/HistoryPage';
import { WatchLaterPage } from './pages/WatchLaterPage';
import { LikedVideosPage } from './pages/LikedVideosPage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { PlaylistEditPage } from './pages/PlaylistEditPage';

// Account & Notification Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { PrivacySettingsPage } from './pages/PrivacySettingsPage';
import { NotificationPreferencesPage } from './pages/NotificationPreferencesPage';

// Creator Studio Pages
import { StudioDashboardPage } from './pages/studio/StudioDashboardPage';
import { StudioContentPage } from './pages/studio/StudioContentPage';
import { StudioUploadPage } from './pages/studio/StudioUploadPage';
import { StudioEditVideoPage } from './pages/studio/StudioEditVideoPage';
import { StudioAnalyticsPage } from './pages/studio/StudioAnalyticsPage';
import { StudioCommentsPage } from './pages/studio/StudioCommentsPage';
import { StudioCustomizationPage } from './pages/studio/StudioCustomizationPage';
import { StudioSettingsPage } from './pages/studio/StudioSettingsPage';

// 404 Fallback
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Viewer and Public Experience */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />

              {/* OTT Cinema & Streaming Hub Routes */}
              <Route path="movies" element={<MoviesPage />} />
              <Route path="tv-shows" element={<TVShowsPage />} />
              <Route path="new-and-popular" element={<NewAndPopularPage />} />
              <Route path="movie/:movieId" element={<MovieDetailsPage />} />
              <Route path="series/:seriesId" element={<SeriesDetailsPage />} />
              <Route path="watch/:videoId" element={<WatchPage />} />
              <Route path="continue-watching" element={<ContinueWatchingPage />} />
              <Route path="my-list" element={<MyListPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="genres/:genre" element={<GenreDetailsPage />} />
              <Route path="genre/:genre" element={<GenreDetailsPage />} />
              <Route path="country/:country" element={<CountryPage />} />

              {/* Creator Ecosystem Routes */}
              <Route path="creators" element={<CreatorsPage />} />
              <Route path="creator/:creatorId" element={<CreatorProfilePage />} />
              <Route path="channel/:channelId" element={<ChannelPage />} />
              <Route path="shorts" element={<ShortsPage />} />
              <Route path="shorts/:videoId" element={<ShortsPage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="trending" element={<TrendingPage />} />
              <Route path="subscriptions" element={<SubscriptionsPage />} />
              <Route path="category/:categorySlug" element={<CategoryPage />} />
              <Route path="playlist/:playlistId" element={<PlaylistPage />} />

              {/* Personal Library Experience */}
              <Route path="library" element={<LibraryPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="watch-later" element={<WatchLaterPage />} />
              <Route path="liked-videos" element={<LikedVideosPage />} />
              <Route path="playlists" element={<PlaylistsPage />} />
              <Route path="playlist/:playlistId/edit" element={<PlaylistEditPage />} />

              {/* Notifications */}
              <Route path="notifications" element={<NotificationsPage />} />

              {/* Profile & Settings Shortcuts */}
              <Route path="profile" element={<Navigate to="/settings/profile" replace />} />
              <Route path="top-10" element={<Navigate to="/new-and-popular" replace />} />

              {/* Settings Experience */}
              <Route path="settings" element={<SettingsPage />}>
                <Route path="profile" element={<ProfileSettingsPage />} />
                <Route path="privacy" element={<PrivacySettingsPage />} />
                <Route path="notifications" element={<NotificationPreferencesPage />} />
              </Route>

              {/* 404 inside app shell */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Creator Studio Experience */}
            <Route path="/studio" element={<StudioLayout />}>
              <Route index element={<StudioDashboardPage />} />
              <Route path="content" element={<StudioContentPage />} />
              <Route path="upload" element={<StudioUploadPage />} />
              <Route path="videos/:videoId/edit" element={<StudioEditVideoPage />} />
              <Route path="analytics" element={<StudioAnalyticsPage />} />
              <Route path="comments" element={<StudioCommentsPage />} />
              <Route path="customization" element={<StudioCustomizationPage />} />
              <Route path="settings" element={<StudioSettingsPage />} />
            </Route>

            {/* Authentication Pages */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
