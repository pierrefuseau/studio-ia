import React from 'react';

interface MockFrameProps {
  device: 'mobile' | 'desktop';
  url: string;
  children: React.ReactNode;
}

function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[320px]">
      <div className="relative rounded-[3rem] border-[3px] border-[#2C2C2E] bg-[#1C1C1E] p-[2px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)]">
        <div className="absolute -left-[5px] top-[72px] h-7 w-[3px] rounded-l-sm bg-[#3A3A3C]" />
        <div className="absolute -left-[5px] top-[112px] h-12 w-[3px] rounded-l-sm bg-[#3A3A3C]" />
        <div className="absolute -left-[5px] top-[140px] h-12 w-[3px] rounded-l-sm bg-[#3A3A3C]" />
        <div className="absolute -right-[5px] top-[116px] h-16 w-[3px] rounded-r-sm bg-[#3A3A3C]" />

        <div className="overflow-hidden rounded-[2.7rem] bg-white">
          <div className="relative flex items-start justify-between bg-white px-6 pb-1.5 pt-3">
            <span
              className="relative z-10 text-[13px] font-semibold tracking-tight text-black"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif' }}
            >
              9:41
            </span>

            <div className="absolute left-1/2 top-[10px] z-20 flex h-[28px] w-[100px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-[14px]">
              <div className="h-[10px] w-[10px] rounded-full bg-[#0E1117] ring-[1.5px] ring-[#1D1F24]" />
            </div>

            <div className="relative z-10 flex items-center gap-1">
              <svg className="h-[14px] w-[18px]" viewBox="0 0 18 14" fill="black">
                <rect x="0" y="9" width="3" height="5" rx="0.75" />
                <rect x="5" y="6" width="3" height="8" rx="0.75" />
                <rect x="10" y="3" width="3" height="11" rx="0.75" />
                <rect x="15" y="0" width="3" height="14" rx="0.75" />
              </svg>
              <svg className="h-[14px] w-[16px]" viewBox="0 0 16 12" fill="black">
                <path d="M8 9.6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
                <path d="M4.93 8.07a4.37 4.37 0 0 1 6.14 0" fill="none" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M2.1 5.24a8.18 8.18 0 0 1 11.8 0" fill="none" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <div className="flex items-center">
                <div className="relative flex h-[12px] w-[23px] items-center rounded-[3px] border-[1.5px] border-black/35 px-[1.5px]">
                  <div className="h-[7px] w-full rounded-[1px] bg-black" />
                </div>
                <div className="ml-[1px] h-[5px] w-[1.5px] rounded-r-[1px] bg-black/35" />
              </div>
            </div>
          </div>

          <div className="max-h-[540px] overflow-y-auto scrollbar-none">{children}</div>

          <div className="flex justify-center bg-white pb-2 pt-1">
            <div className="h-[5px] w-[120px] rounded-full bg-black/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChromeFrame({ url, children }: { url: string; children: React.ReactNode }) {
  const domain = url.split('/')[0];

  return (
    <div className="mx-auto w-full max-w-full sm:max-w-[620px] md:max-w-[700px] lg:max-w-[900px] overflow-hidden rounded-xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]">
      <div className="flex items-end bg-[#DEE1E6] px-3 pt-2">
        <div className="flex items-center gap-2 px-2 pb-2">
          <span className="h-[12px] w-[12px] rounded-full bg-[#FF5F57]" />
          <span className="h-[12px] w-[12px] rounded-full bg-[#FEBC2E]" />
          <span className="h-[12px] w-[12px] rounded-full bg-[#28C840]" />
        </div>

        <div className="ml-2 flex max-w-[240px] items-center gap-2 rounded-t-lg bg-white px-4 py-[7px]">
          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-gray-200 text-[8px] font-bold text-gray-500">
            {domain.charAt(0).toUpperCase()}
          </div>
          <span className="truncate text-[12px] font-medium text-gray-700">{domain}</span>
          <svg className="ml-auto h-3.5 w-3.5 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </div>

        <div className="mb-1 ml-1 rounded p-1 text-gray-500 hover:bg-black/5">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-3 py-1.5">
        <div className="flex items-center gap-0.5 text-gray-400">
          <button className="rounded p-1 hover:bg-gray-100">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className="rounded p-1 opacity-40 hover:bg-gray-100">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <button className="ml-0.5 rounded p-1 hover:bg-gray-100">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 items-center gap-2 rounded-full bg-[#F1F3F4] px-3 py-[5px]">
          <svg className="h-3.5 w-3.5 shrink-0 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span className="truncate text-[13px] text-gray-700">{url}</span>
        </div>
      </div>

      <div className="max-h-[400px] sm:max-h-[480px] lg:max-h-[560px] overflow-y-auto">{children}</div>
    </div>
  );
}

export default function MockFrame({ device, url, children }: MockFrameProps) {
  if (device === 'mobile') {
    return <IPhoneFrame>{children}</IPhoneFrame>;
  }
  return <ChromeFrame url={url}>{children}</ChromeFrame>;
}
