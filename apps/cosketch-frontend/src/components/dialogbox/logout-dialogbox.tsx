import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { fraunces } from '@/data/fonts';
import { LogOut } from 'lucide-react';

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
      className='fixed inset-0 z-[1100] flex items-center justify-center bg-[#1a1916]/25 px-4 backdrop-blur-sm'
      onClick={() => onClose(false)}
      role='dialog'
      aria-modal='true'
    >
      <div
        className='w-full max-w-sm rounded-2xl bg-[#f9f6ef] p-7 shadow-2xl shadow-[#1a1916]/15 ring-1 ring-[#e8e2d4]'
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className='mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8e2d4] bg-white text-[#7a7770]'>
          <LogOut size={18} />
        </div>

        {/* Heading */}
        <h2
          className={`${fraunces.className} mb-2 text-2xl font-semibold text-[#1a1916]`}
        >
          Sign out?
        </h2>
        <p className='text-sm leading-relaxed text-[#7a7770]'>
          You&apos;ll need to sign back in to access your workspaces and rooms.
        </p>

        {/* Buttons */}
        <div className='mt-7 flex items-center justify-end gap-2.5'>
          <button
            className='rounded-lg border border-[#e8e2d4] px-4 py-2 text-sm font-medium text-[#7a7770] transition-colors hover:border-[#1a1916]/20 hover:text-[#1a1916]'
            onClick={() => onClose(false)}
          >
            Cancel
          </button>
          <button
            className='rounded-lg bg-[#1a1916] px-4 py-2 text-sm font-semibold text-[#f9f6ef] transition-colors hover:bg-[#2d2c26]'
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </div>
    </section>
  );
};
