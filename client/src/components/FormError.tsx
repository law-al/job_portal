interface FormErrorProps {
  message?: string;
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p className='mt-0.5 text-sm text-red-600 flex items-center gap-1'>
      {message}
    </p>
  );
}
