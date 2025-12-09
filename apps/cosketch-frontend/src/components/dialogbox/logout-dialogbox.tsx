import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface LogoutDialogBoxProps {
  isOpen: boolean;
  onClose: (e: boolean) => void;
}

export const LogoutDialogBox = ({ onClose, isOpen }: LogoutDialogBoxProps) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <section
      className='fixed inset-0 z-1100 flex h-screen items-center justify-center bg-black/30 backdrop-blur-md'
      onClick={() => {
        onClose(false);
      }} // Close when clicking outside
      role='dialog'
      aria-modal='true'
    >
      <div
        className='w-[90%] max-w-md rounded-xl bg-white p-6 shadow-lg'
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className='text-secondary mb-2 text-2xl font-semibold'>
          Confirm Logout
        </h2>
        <p className='text-gray-600'>
          Are you sure you want to logout? You will need to sign in again to
          access your rooms.
        </p>

        {/* Action Buttons */}
        <div className='mt-6 flex justify-end gap-2 font-bold'>
          <button
            className='cursor-pointer rounded-lg border px-4 py-2 text-gray-600 transition hover:bg-gray-100'
            onClick={() => {
              onClose(false);
            }}
          >
            Cancel
          </button>
          <button
            className='cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700'
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
};
