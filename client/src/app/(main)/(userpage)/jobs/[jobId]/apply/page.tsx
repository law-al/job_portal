import ResumeUpload from './components/ResumeUpload';
import DetailsPage from './components/DetailsPage';
import SupportingDocuments from './components/SupportingDocuments';
import ReviewApplication from './components/ReviewApplication';
import { ApplicationProvider } from './provider';
import ApplicationForm from './components/ApplicationForm';

export default async function JobApplicationForm({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  return (
    <ApplicationProvider>
      <ApplicationForm jobId={jobId} />
    </ApplicationProvider>
  );
}
