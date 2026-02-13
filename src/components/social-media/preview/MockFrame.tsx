import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MockFrameProps {
  device: 'mobile' | 'desktop';
  url: string;
  children: React.ReactNode;
}

function MobileFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[320px] origin-top scale-[0.85] xs:scale-100 transition-transform">
      <div className="relative rounded-[2.5rem] border-[3px] border-gray-800 bg-gray-800 shadow-xl">
        <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-gray-800" />

        <div className="overflow-hidden rounded-[2.2rem] bg-white">
          <div className="flex items-center justify-between bg-white px-6 pb-1 pt-3">
            <span className="text-xs font-semibold text-gray-900">9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="h-3 w-3 text-gray-900" />
              <Wifi className="h-3 w-3 text-gray-900" />
              <Battery className="h-3.5 w-3.5 text-gray-900" />
            </div>
          </div>

          <div className="mx-3 mb-2 flex items-center rounded-lg bg-gray-100 px-3 py-1.5">
            <span className="truncate text-[10px] text-gray-500">{url}</span>
          </div>

          <div className="max-h-[560px] overflow-y-auto">{children}</div>

          <div className="flex justify-center pb-2 pt-1">
            <div className="h-1 w-28 rounded-full bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-full sm:max-w-[700px] lg:max-w-[900px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="ml-4 flex flex-1 items-center rounded-md bg-white px-3 py-1 text-xs text-gray-500 ring-1 ring-gray-200">
          <span className="truncate">{url}</span>
        </div>
      </div>

      <div className="max-h-[400px] sm:max-h-[480px] lg:max-h-[560px] overflow-y-auto">{children}</div>
    </div>
  );
}

export default function MockFrame({ device, url, children }: MockFrameProps) {
  if (device === 'mobile') {
    return <MobileFrame url={url} children={children} />;
  }
  return <DesktopFrame url={url} children={children} />;
}
