'use client';

import React, { useEffect, useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { FiTrendingUp, FiSmartphone, FiGlobe, FiActivity } from 'react-icons/fi';
import { QRCodeType } from '@/schemas/qrcode';

const COLORS = ['#D4AF37', '#8B7322', '#654321', '#9E9E9E', '#E0E0E0'];

import IncenseLoader from '@/app/components/IncenseLoader';

export default function AnalyticsPage() {
    const [data, setData] = useState<QRCodeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState<'7' | '30' | 'all'>('30');

    useEffect(() => {
        fetch('/api/qrcodes')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const { trendData, totalScans, activeCodes, totalCodes, countryData, cityData, typeDistributionData, topCodesData } = React.useMemo(() => {
        const now = new Date();
        const filterByTimeframe = (timestamp: string | Date) => {
            if (timeframe === 'all') return true;
            const date = new Date(timestamp);
            const diffDays = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
            return diffDays <= parseInt(timeframe);
        };

        // Filter data once
        const filteredQRs = data.map(qr => ({
            ...qr,
            scans: (qr.scans || []).filter(scan => filterByTimeframe(scan.timestamp))
        }));

        const allScans = filteredQRs.flatMap(qr => qr.scans);
        const totalScans = allScans.length;
        const activeCodes = data.filter(q => (q.status || 'active') === 'active').length;
        const totalCodes = data.length;

        // Trend Data with Date Pre-filling
        const scansByDate: Record<string, number> = {};

        if (timeframe !== 'all') {
            const daysToFill = parseInt(timeframe);
            for (let i = daysToFill - 1; i >= 0; i--) {
                const date = new Date();
                date.setDate(now.getDate() - i);
                const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                scansByDate[dateStr] = 0;
            }
        }

        allScans.forEach(scan => {
            const dateStr = new Date(scan.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            scansByDate[dateStr] = (scansByDate[dateStr] || 0) + 1;
        });

        const trendData = Object.keys(scansByDate).map(date => ({
            name: date,
            scans: scansByDate[date]
        })).sort((a, b) => {
            // More robust sorting for dates
            const year = now.getFullYear();
            return new Date(`${a.name}, ${year}`).getTime() - new Date(`${b.name}, ${year}`).getTime();
        });

        // Top Performing Codes (based on filtered scans)
        const topCodesData = [...filteredQRs]
            .sort((a, b) => b.scans.length - a.scans.length)
            .slice(0, 5)
            .map(qr => ({
                name: qr.name,
                value: qr.scans.length
            }));

        // Geographic Data (filtered)
        const countryDataMap: Record<string, number> = {};
        const cityDataMap: Record<string, number> = {};
        allScans.forEach((scan: any) => {
            if (scan.country) countryDataMap[scan.country] = (countryDataMap[scan.country] || 0) + 1;
            if (scan.city) cityDataMap[scan.city] = (cityDataMap[scan.city] || 0) + 1;
        });

        const countryData = Object.keys(countryDataMap)
            .map(country => ({ name: country, value: countryDataMap[country] }))
            .sort((a, b) => b.value - a.value).slice(0, 5);

        const cityData = Object.keys(cityDataMap)
            .map(city => ({ name: city, value: cityDataMap[city] }))
            .sort((a, b) => b.value - a.value).slice(0, 5);

        // Type Distribution
        const typeDataMap: Record<string, number> = {};
        data.forEach(qr => {
            typeDataMap[qr.type] = (typeDataMap[qr.type] || 0) + 1;
        });
        const typeDistributionData = Object.keys(typeDataMap).map(type => ({
            name: type.charAt(0).toUpperCase() + type.slice(1),
            value: typeDataMap[type]
        }));

        return { trendData, totalScans, activeCodes, totalCodes, countryData, cityData, typeDistributionData, topCodesData };
    }, [data, timeframe]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <IncenseLoader />
        </div>
    );

    const kpiCards = [
        { title: 'Total Engagements', value: totalScans, icon: <FiActivity className="text-[#D4AF37]" />, detail: 'Pure QR connections' },
        { title: 'Active Channels', value: activeCodes, icon: <FiTrendingUp className="text-green-500" />, detail: `${totalCodes} total created` },
        { title: 'Highest Purity', value: activeCodes > 0 ? 'Optimal' : 'Checking', icon: <FiSmartphone className="text-purple-400" />, detail: 'Broadcast Status' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white">Analytics Overview</h2>
                <p className="text-gray-400 mt-1">performance metrics and insights for your QR codes.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kpiCards.map((card, i) => (
                    <div key={i} className="bg-[#121212]/50 backdrop-blur-md p-6 rounded-xl shadow-sm border border-[#333]/50 hover:border-[#D4AF37]/30 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-[#1a1a1a] rounded-lg">
                                {card.icon}
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{card.value}</h3>
                        <p className="text-sm text-gray-400 font-medium">{card.title}</p>
                        <p className="text-xs text-[#D4AF37] mt-2 font-medium bg-[#D4AF37]/10 inline-block px-2 py-1 rounded-full">
                            {card.detail}
                        </p>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Scans Trend */}
                <div className="bg-[#121212]/50 backdrop-blur-md p-6 rounded-xl shadow-sm border border-[#333]/50 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Scan Activity Trend</h3>
                        <select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value as any)}
                            className="text-sm bg-[#1a1a1a] border-[#333] rounded-lg text-gray-300 focus:ring-[#D4AF37] focus:border-[#D4AF37] cursor-pointer outline-none transition-all hover:border-[#D4AF37]/50 p-2"
                        >
                            <option value="30">Last 30 Days</option>
                            <option value="7">Last 7 Days</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)', color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="scans" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Geographic Distribution */}
                <div className="bg-[#121212]/50 backdrop-blur-md p-6 rounded-xl shadow-sm border border-[#333]/50 hover:border-[#D4AF37]/30 transition-all duration-300">
                    <h3 className="text-lg font-bold text-white mb-6">Top Locations (Country)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={countryData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#222" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#888' }} />
                                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#222' }} contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333', color: '#fff' }} />
                                <Bar dataKey="value" fill="#D4AF37" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Cities List */}
                <div className="bg-[#121212]/50 backdrop-blur-md p-6 rounded-xl shadow-sm border border-[#333]/50 hover:border-[#D4AF37]/30 transition-all duration-300">
                    <h3 className="text-lg font-bold text-white mb-6">Top Cities</h3>
                    <div className="space-y-4 overflow-y-auto max-h-80 pr-2">
                        {cityData.length > 0 ? cityData.map((city, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[#D4AF37] font-semibold text-xs">
                                        {i + 1}
                                    </div>
                                    <span className="text-sm font-medium text-gray-300">{city.name}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-24 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#D4AF37] rounded-full"
                                            style={{ width: `${(city.value / (cityData[0]?.value || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-500 w-8 text-right">{city.value}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-gray-600 py-10 text-sm">No location data available yet</div>
                        )}
                    </div>
                </div>

                {/* Device Distribution */}
                <div className="bg-[#121212]/50 backdrop-blur-md p-6 rounded-xl shadow-sm border border-[#333]/50 hover:border-[#D4AF37]/30 transition-all duration-300">
                    <h3 className="text-lg font-bold text-white mb-6">Device Distribution</h3>
                    <div className="h-64 w-full flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {typeDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333', color: '#fff' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#888' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Codes Table */}
                <div className="bg-[#121212]/50 backdrop-blur-md p-6 rounded-xl shadow-sm border border-[#333]/50 hover:border-[#D4AF37]/30 transition-all duration-300">
                    <h3 className="text-lg font-bold text-white mb-6">Top Performing Campaigns</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-[#222]">
                                    <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign Name</th>
                                    <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Scans</th>
                                    <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#222]">
                                {topCodesData.map((code: any, i: number) => (
                                    <tr key={i} className="group hover:bg-[#1a1a1a] transition-colors">
                                        <td className="py-3 text-sm font-medium text-gray-200">{code.name}</td>
                                        <td className="py-3 text-sm text-gray-500 text-right">{code.value}</td>
                                        <td className="py-3 text-right">
                                            <span className="inline-flex items-center text-xs font-medium text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded-full">
                                                <FiTrendingUp className="mr-1" /> High
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
