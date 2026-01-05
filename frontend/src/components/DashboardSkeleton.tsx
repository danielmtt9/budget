import React from 'react';

const SkeletonPulse = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-slate-200 dark:bg-white/10 rounded-xl ${className}`}></div>
);

const DashboardSkeleton = () => {
    return (
        <div className="flex flex-col w-full min-h-full bg-background-light dark:bg-[#0b1118] font-display p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
            {/* Header Skeleton */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-4">
                    <SkeletonPulse className="h-3 w-32" />
                    <SkeletonPulse className="h-16 w-64 md:w-96" />
                    <SkeletonPulse className="h-6 w-48" />
                </div>
                <SkeletonPulse className="h-14 w-40 rounded-2xl" />
            </header>

            {/* Main Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    {/* Hero Card Skeleton */}
                    <div className="rounded-[2rem] bg-slate-900 border border-white/10 p-10 h-[400px] flex flex-col justify-between">
                        <div className="space-y-4">
                            <SkeletonPulse className="h-4 w-24 bg-white/20" />
                            <SkeletonPulse className="h-20 w-80 bg-white/20" />
                            <div className="flex gap-4">
                                <SkeletonPulse className="h-6 w-32 bg-white/20 rounded-full" />
                                <SkeletonPulse className="h-6 w-32 bg-white/20 rounded-full" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="space-y-2">
                                    <SkeletonPulse className="h-3 w-20 bg-white/20" />
                                    <SkeletonPulse className="h-8 w-32 bg-white/20" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chart Skeleton */}
                    <div className="rounded-[2rem] bg-white dark:bg-white/5 p-8 border border-slate-200 dark:border-white/10 h-[450px]">
                        <div className="flex justify-between mb-10">
                            <div className="space-y-2">
                                <SkeletonPulse className="h-6 w-48" />
                                <SkeletonPulse className="h-4 w-64" />
                            </div>
                            <div className="flex gap-2">
                                <SkeletonPulse className="h-6 w-20 rounded-full" />
                                <SkeletonPulse className="h-6 w-20 rounded-full" />
                            </div>
                        </div>
                        <SkeletonPulse className="h-[300px] w-full" />
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    {[1, 2].map(i => (
                        <div key={i} className="rounded-[2rem] bg-white dark:bg-white/5 p-8 border border-slate-200 dark:border-white/10 h-[350px]">
                            <div className="flex justify-between mb-8">
                                <SkeletonPulse className="h-6 w-32" />
                                <SkeletonPulse className="h-5 w-16 rounded-full" />
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3].map(j => (
                                    <div key={j} className="flex items-center gap-4">
                                        <SkeletonPulse className="size-12 rounded-xl" />
                                        <div className="space-y-2 flex-1">
                                            <SkeletonPulse className="h-4 w-full" />
                                            <SkeletonPulse className="h-3 w-2/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
