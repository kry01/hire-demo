import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './theme.css';
import './App.css';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import ProjectForm from './pages/ProjectForm';
import ProjectsList from './pages/ProjectsList';
import ProfileForm from './pages/ProfileForm';
import ProfileDetail from './pages/ProfileDetail';
import PublicationForm from './pages/PublicationForm';
import PublicationsList from './pages/PublicationsList';
import CVImport from './pages/CVImport';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/new" element={<ProjectForm />} />
          <Route path="/profiles" element={<Dashboard />} />
          <Route path="/profiles/new" element={<ProfileForm />} />
          <Route path="/profiles/:profileId" element={<ProfileDetail />} />
          <Route path="/publications/new" element={<PublicationForm />} />
          <Route path="/publications" element={<PublicationsList />} />
          <Route path="/candidates" element={<Dashboard />} />
          <Route path="/candidates/import" element={<CVImport />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;