import Tabs from './Tabs';
import ApplicationHeader from './ApplicationHeader';
import SearchAndSort from './SearchAndSort';
import ApplicationList from './ApplicationList';
import ApplicationPagination from './ApplicationPagination';
import type { ApplicationSearchParams, Application, Pagination } from '@/types';

interface MyApplicationsProps {
  params: ApplicationSearchParams;
  applications: Application[];
  pagination: Pagination;
}

const JobApplicationsPage = ({ applications, pagination }: MyApplicationsProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ApplicationHeader />
        <Tabs />
        <SearchAndSort />
        <ApplicationList applications={applications} />
        <ApplicationPagination pagination={pagination} />
      </div>
    </div>
  );
};

export default JobApplicationsPage;
