'use client';

import { authorize } from '@/api/auth';
import Spinner from '@/components/spinner';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fraunces } from '@/data/fonts';
import Logo from '@/components/landing-page/logo';

interface ProtectRouteProps {
  children: React.ReactNode;
}

const ProtectRoute: React.FC<ProtectRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const authorizeMutation = useMutation({
    mutationFn: authorize,
    onSuccess: data => {
      toast.success(data.message || 'Authentication successful');
      setIsLoading(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Unauthorized access');
      router.replace('/signin');
    },
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      router.replace('/signin');
    } else {
      authorizeMutation.mutate({ token: storedToken });
    }

    return () => setIsLoading(false);
  }, []);

  if (isLoading || authorizeMutation.isPending) {
    return (
      <div className='flex h-screen flex-col items-center justify-center bg-[#f9f6ef]'>
        {/* Brand mark */}
        <div className='mb-10'>
          <Logo />
        </div>

        {/* Spinner */}
        <Spinner size={48} />

        {/* Status text */}
        <p
          className={`${fraunces.className} mt-5 text-sm italic text-[#7a7770]`}
        >
          Verifying your session&hellip;
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectRoute;
