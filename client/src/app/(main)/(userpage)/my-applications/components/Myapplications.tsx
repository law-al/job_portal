import Tabs from './Tabs';
import ApplicationHeader from './ApplicationHeader';
import SearchAndSort from './SearchAndSort';
import ApplicationList from './ApplicationList';
import ApplicationPagination from './ApplicationPagination';

interface SearchParams {
  tab?: string;
  sortBy?: string;
  search?: string;
  page?: string;
  limit?: string;
  status?: string;
  jobId?: string;
}

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  job: {
    id: string;
    title: string;
    slug: string;
    status: string;
    company: {
      id: string;
      name: string;
    };
  };
  pipelineStage: {
    id: string;
    name: string;
    order: number;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface MyApplicationsProps {
  params: SearchParams;
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
