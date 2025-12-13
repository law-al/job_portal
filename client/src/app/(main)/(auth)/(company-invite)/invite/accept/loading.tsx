export default function Loading() {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4'>
      <div className='w-full max-w-md mb-8'>
        <div className='flex items-center justify-center gap-2'>
          <div className='w-8 h-8 bg-gray-800 rounded'></div>
          <span className='text-xl font-semibold'>YourCompanyName</span>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-md p-8 w-full max-w-md'>
        <div className='text-center'>
          <div className='mb-6 flex justify-center'>
            <div className='relative'>
              <div className='w-16 h-16 border-4 border-gray-200 rounded-full'></div>
              <div className='absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin'></div>
            </div>
          </div>

          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Loading Your Invitation
          </h2>

          <p className='text-gray-600'>
            Please wait while we verify your invitation...
          </p>
        </div>

        <div className='mt-8 space-y-3'>
          <div className='h-10 bg-gray-100 rounded-lg animate-pulse'></div>
          <div className='h-10 bg-gray-100 rounded-lg animate-pulse'></div>
          <div className='h-12 bg-gray-100 rounded-lg animate-pulse'></div>
        </div>
      </div>
    </div>
  );
}
