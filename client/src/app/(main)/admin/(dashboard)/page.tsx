import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import Header from './components/Header';
import MainWrapper from './components/MainWrapper';
import AppBreadCrumb from '@/components/AppBreadCrumb';
import CardWrapper from './components/CardWrapper';
import ChartComponent from './components/ChartComponent';
import LatestApplication from './components/LatestApplication';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Header session={session} />
      <MainWrapper>
        <AppBreadCrumb items={[{ label: 'Dashboard Overview' }]} homeHref="/admin" className="mb-6" />
        <CardWrapper />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartComponent />
          <LatestApplication />
        </div>
      </MainWrapper>
    </>
  );
}
