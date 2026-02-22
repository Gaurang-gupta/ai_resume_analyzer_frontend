"use client";

import { useMemo } from "react";
import { FrontEndFullAnalzeRow } from "@/types";
import {
    Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
    Area, BarChart, Bar, ReferenceLine, ComposedChart
} from "recharts";
import Card from "@/app/components/ui/Card";
import { BarChart3, TrendingUp, AlertCircle, Info } from "lucide-react";
import AnimatedScore from "@/app/components/ui/AnimatedScore";

// Types stay the same
interface ChartPoint { index: number; score: number; movingAverage: number; date: string; job: string; }
interface SkillGapPoint { skill: string; count: number; }
interface ScoreDistributionPoint { range: string; count: number; }

const BENCHMARK_SCORE = 80;

export default function ResumePerformancePage({ analyses }: { analyses: FrontEndFullAnalzeRow[] }) {
        // ================= BASIC METRICS =================

    const totalCompleted = analyses.length;

    const averageScore = useMemo(() => {
        if (!analyses.length) return 0;
        return (
            analyses.reduce((sum, a) => sum + a.result.overallScore, 0) /
            analyses.length
        );
    }, [analyses]);

    const volatility = useMemo(() => {
        if (analyses.length < 2) return 0;

        const scores = analyses.map(a => a.result.overallScore);
        const mean =
            scores.reduce((sum, s) => sum + s, 0) / scores.length;

        const variance =
            scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) /
            scores.length;

        return Math.sqrt(variance);
    }, [analyses]);

    const latestAnalysis = analyses[analyses.length - 1];

    // ================= MOVING AVERAGE =================

    const chartData: ChartPoint[] = useMemo(() => {
        const windowSize = 3;

        return analyses.map((a, index) => {
            const start = Math.max(0, index - windowSize + 1);
            const subset = analyses.slice(start, index + 1);
            const avg =
                subset.reduce((sum, s) => sum + s.result.overallScore, 0) /
                subset.length;

            return {
                index: index + 1,
                score: a.result.overallScore,
                movingAverage: Number(avg.toFixed(2)),
                date: new Date(a.created_at).toLocaleDateString(),
                job: a.job_title,
            };
        });
    }, [analyses]);

    // ================= SKILL GAP FREQUENCY =================

    const skillGapData: SkillGapPoint[] = useMemo(() => {
        const counter: Record<string, number> = {};

        analyses.forEach(a => {
            a.result.skills.missing.forEach(skill => {
                counter[skill] = (counter[skill] || 0) + 1;
            });
        });

        return Object.entries(counter)
            .map(([skill, count]) => ({ skill, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
    }, [analyses]);

    // if (loading) return <div className="p-8">Loading...</div>;
    const scoreDistribution: ScoreDistributionPoint[] = useMemo(() => {
        const ranges = [
            { min: 0, max: 60, label: "0-60" },
            { min: 60, max: 70, label: "60-70" },
            { min: 70, max: 80, label: "70-80" },
            { min: 80, max: 90, label: "80-90" },
            { min: 90, max: 100, label: "90-100" },
        ];

        return ranges.map(r => ({
            range: r.label,
            count: analyses.filter(
                a =>
                    a.result.overallScore >= r.min &&
                    a.result.overallScore < r.max
            ).length,
        }));
    }, [analyses]);

    if (!analyses.length) {
        return (
            <div className="p-8 text-xl font-semibold">
                No completed analyses yet
            </div>
        );
    }

    // (Logic truncated for brevity, but keep your existing useMemos here)

    if (!analyses.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <BarChart3 className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-xl font-bold text-slate-600">No data points available</p>
                <p className="text-slate-400">Complete an analysis to see your performance metrics.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 lg:space-y-12">

            {/* ================= TOP METRIC GRID ================= */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="Analyses" value={totalCompleted} subValue="Reports generated" color="indigo" />
                <MetricCard label="Avg Score" value={`${averageScore.toFixed(1)}%`} subValue="Overall match" color="emerald" />
                <MetricCard label="Volatility" value={volatility.toFixed(1)} subValue="Score stability" color="amber" />
                <MetricCard label="Latest" value={`${latestAnalysis?.result.overallScore ?? 0}%`} subValue="Latest attempt" color="blue" />
            </div>

            {/* ================= PRIMARY TREND CHART ================= */}
            <Card className="p-6 sm:p-10 border-slate-200 shadow-xl rounded-[2rem] overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            Score Evolution <TrendingUp className="text-indigo-500 w-6 h-6" />
                        </h2>
                        <p className="text-sm text-slate-500 font-medium">Tracking your resume&apos;s performance across applications</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-600" /> Score</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Trend</div>
                    </div>
                </div>

                <div className="h-[350px] sm:h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="index"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis
                                domain={[0, 100]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                            />
                            <ReferenceLine
                                y={BENCHMARK_SCORE}
                                stroke="#f43f5e"
                                strokeDasharray="8 4"
                                label={{ position: 'right', value: 'Target', fill: '#f43f5e', fontSize: 10, fontWeight: 800 }}
                            />
                            <Area type="monotone" dataKey="score" stroke="#4f46e5" fillOpacity={1} fill="url(#colorScore)" strokeWidth={4} />
                            <Line type="monotone" dataKey="movingAverage" stroke="#10b981" strokeWidth={3} dot={false} strokeDasharray="5 5" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ================= SKILL GAPS ================= */}
                <Card className="p-8 border-slate-200 rounded-[2rem]">
                    <div className="flex items-center gap-3 mb-6">
                        <AlertCircle className="text-amber-500 w-6 h-6" />
                        <h2 className="text-xl font-bold text-slate-900">Critical Skill Gaps</h2>
                    </div>
                    <p className="text-sm text-slate-500 mb-8">Skills requested most frequently that aren&apos;t present in your current resume.</p>

                    <div className="space-y-4">
                        {skillGapData.map((skill, index) => (
                            <div key={index} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        {index + 1}
                                    </div>
                                    <span className="font-semibold text-slate-700">{skill.skill}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full"
                                            style={{ width: `${(skill.count / totalCompleted) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                        {skill.count}x
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* ================= DISTRIBUTION ================= */}
                <ChartContainer title="Score Distribution" subtitle="Spread of your application match scores">
                    <BarChart data={scoreDistribution} margin={{ top: 20, right: 0, left: -30, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                        <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                </ChartContainer>
            </div>

            {/* ================= LATEST SUMMARY ================= */}
            {latestAnalysis && (
                <Card className="p-8 border-none bg-indigo-600 text-white rounded-[2rem] shadow-2xl shadow-indigo-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Info size={120} />
                    </div>
                    <div className="relative z-10 max-w-3xl">
                        <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                            Latest Strategy Insight
                        </h2>
                        <p className="text-indigo-100 leading-relaxed text-lg italic">
                            &ldquo;{latestAnalysis.result.summary}&rdquo;
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
}

// Reusable Inner Components
function MetricCard({ label, value, subValue, color }: { label: string, value: string | number, subValue: string, color: string }) {
    const colorMap: Record<string, string> = {
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
        blue: "text-blue-600 bg-blue-50 border-blue-100"
    };

    return (
        <Card className="p-5 sm:p-6 border-slate-200 rounded-2xl sm:rounded-3xl hover:shadow-md transition-all group">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                {typeof value === "number" ?
                <AnimatedScore score={Number(value)}/> :
                    <AnimatedScore showPercentage={true} score={Number(value.slice(0, value.length - 1))}/>
                }
            </p>
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 mt-2 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${colorMap[color].split(' ')[1]}`} />
                {subValue}
            </p>
        </Card>
    );
}

function ChartContainer({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactElement; }) {
    return (
        <Card className="p-8 border-slate-200 rounded-[2rem]">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </Card>
    );
}