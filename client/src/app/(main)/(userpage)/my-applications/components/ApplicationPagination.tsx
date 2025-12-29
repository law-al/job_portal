import Pagination from '@/components/Pagination';

interface ApplicationPaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ApplicationPagination({ pagination }: ApplicationPaginationProps) {
  return <Pagination pagination={pagination} basePath="/my-applications" itemName="applications" />;
}
