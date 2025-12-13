import { fetchWithRetry } from '@/lib/fetchWithRetry';
import Form from './components/NewUserSignupForm';
import UserEmailPage from './components/ExistingUserLogin';
import NewUserSignupForm from './components/NewUserSignupForm';
import ExistingUserLogin from './components/ExistingUserLogin';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ResponseData {
  id: string;
  email: string;
  role: string;
  companyId: string;
  userExist: boolean;
}

type UserReponseData = ApiResponse<ResponseData>;

export default async function InvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

  if (!token) throw new Error('A token should be provided');

  const response = await fetchWithRetry({
    url: `auth/invite/check?token=${token}`,
    options: {
      credentials: 'include',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || 'Error getting verification status');
  }

  const { success, message, data } = (await response.json()) as UserReponseData;

  console.log(data);

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4'>
      <div className='w-full max-w-md mb-8'>
        <div className='flex items-center justify-center gap-2'>
          <div className='w-8 h-8 bg-gray-800 rounded'></div>
          <span className='text-xl font-semibold'>JobPortal</span>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-md p-8 w-full max-w-md'>
        <h1 className='text-3xl font-bold text-gray-900 text-center mb-2'>
          Accept Your Invitation
        </h1>
        <p className='text-gray-600 text-center mb-8'>
          Welcome to YourCompanyName! Set up your account to join the team.
        </p>

        {data && data.userExist ? (
          <ExistingUserLogin email={data.email} token={token} />
        ) : (
          <NewUserSignupForm email={data.email} token={token} />
        )}
      </div>
    </div>
  );
}
