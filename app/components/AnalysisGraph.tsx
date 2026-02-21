"use client";

import { useMemo } from "react";
import { FrontEndFullAnalzeRow } from "@/types";

import {
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Area,
    AreaChart,
    BarChart,
    Bar,
    Legend,
    ReferenceLine,
} from "recharts";
import SkillBadge from "@/app/components/SkillBadge";

interface ChartPoint {
    index: number;
    score: number;
    movingAverage: number;
    date: string;
    job: string;
}

interface SkillGapPoint {
    skill: string;
    count: number;
}

interface ScoreDistributionPoint {
    range: string;
    count: number;
}

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

    // ================= BREAKDOWN AVERAGE =================

    const breakdownData = useMemo(() => {
        if (!analyses.length) return [];

        const skills =
            analyses.reduce((s, a) => s + a.result.breakdown.skillsMatch, 0) /
            analyses.length;

        const experience =
            analyses.reduce((s, a) => s + a.result.breakdown.experienceMatch, 0) /
            analyses.length;

        const education =
            analyses.reduce((s, a) => s + a.result.breakdown.educationMatch, 0) /
            analyses.length;

        return [
            {
                name: "Average Breakdown",
                skills,
                experience,
                education,
            },
        ];
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

    return (
        <div className="space-y-12">

            {/* ================= HEADER ================= */}
            <div className="grid grid-cols-4 gap-6">
                <MetricCard label="Completed" value={totalCompleted} />
                <MetricCard label="Average Score" value={averageScore.toFixed(1)} />
                <MetricCard label="Volatility" value={volatility.toFixed(1)} />
                <MetricCard
                    label="Latest Score"
                    value={latestAnalysis?.result.overallScore ?? 0}
                />
            </div>

            {/* ================= SCORE TREND ================= */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Score Trend</h2>

                <div className="h-[350px] border rounded-xl p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="index" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />

                            <ReferenceLine
                                y={BENCHMARK_SCORE}
                                stroke="red"
                                strokeDasharray="4 4"
                                label="Target 80"
                            />

                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#2563eb"
                                fillOpacity={1}
                                fill="url(#colorScore)"
                                strokeWidth={3}
                            />

                            <Line
                                type="monotone"
                                dataKey="movingAverage"
                                stroke="#16a34a"
                                strokeWidth={2}
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ================= BREAKDOWN STACKED BAR ================= */}
            <div>
                <h2 className="text-xl font-semibold mb-4">
                    Average Breakdown
                </h2>

                <div className="h-[300px] border rounded-xl p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={breakdownData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="skills" stackId="a" fill="#2563eb" />
                            <Bar dataKey="experience" stackId="a" fill="#16a34a" />
                            <Bar dataKey="education" stackId="a" fill="#f59e0b" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ================= SKILL GAP CHART ================= */}
            <div>
                <h2 className="text-xl font-semibold mb-4">
                    Most Frequent Missing Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                {
                    skillGapData.map((skill, index) => (
                        <SkillBadge key={index + 1} label={skill.skill} variant={"missing"} count={skill.count} />
                    ))
                }
                </div>
            </div>

            {/* Score distribution */}
            <ChartContainer title="Score Distribution">
                <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563eb" />
                </BarChart>
            </ChartContainer>

            {/* ================= SUMMARY ================= */}
            {latestAnalysis && (
                <div className="border p-6 rounded-xl space-y-4">
                    <h2 className="text-xl font-semibold">
                        Latest Analysis Summary
                    </h2>
                    <p>{latestAnalysis.result.summary}</p>
                </div>
            )}
        </div>
    );
}

function ChartContainer({
                            title,
                            children,
                        }: {
    title: string;
    children: React.ReactElement;
}) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="h-[350px] border rounded-xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function MetricCard({
                        label,
                        value,
                    }: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="border rounded-xl p-6">
            <div className="text-sm text-gray-500 mb-2">{label}</div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    );
}

