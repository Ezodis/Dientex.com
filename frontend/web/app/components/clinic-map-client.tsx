'use client';

import dynamic from 'next/dynamic';

const ClinicMap = dynamic(() => import('@/app/components/clinic-map'), { ssr: false });

export default function ClinicMapClient({ onBack }: { onBack?: () => void }) {
  return <div style={{ width: '100%', height: '100%' }}><ClinicMap onBack={onBack} /></div>;
}
