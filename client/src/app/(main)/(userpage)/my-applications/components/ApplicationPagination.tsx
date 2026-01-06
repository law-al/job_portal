import Pagination from '@/components/Pagination';
import type { ApplicationPaginationProps } from '@/types';

export default function ApplicationPagination({ pagination }: ApplicationPaginationProps) {
  return <Pagination pagination={pagination} basePath="/my-applications" itemName="applications" />;
}
