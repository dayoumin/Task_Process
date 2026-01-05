import { useState, useMemo } from 'react';
import type { UploadedFile, FilterOptionsClient } from '@task-process/shared-types';
import { Statistics } from './services/statistics';
import { FileUpload } from './components/upload/FileUpload';
import { UploadProgress } from './components/upload/UploadProgress';
import { StatCard } from './components/stats/StatCard';
import { UserTable } from './components/stats/UserTable';
import { DepartmentChart } from './components/charts/DepartmentChart';
import { ProcessChart } from './components/charts/ProcessChart';
import { TrendChart } from './components/charts/TrendChart';
import { BottleneckChart } from './components/charts/BottleneckChart';
import { FilterPanel } from './components/filters/FilterPanel';
import { exportDepartmentStats, exportUserStats, exportOverallStats, printReport } from './utils/export';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendPeriod, setTrendPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [filters, setFilters] = useState<FilterOptionsClient>({
    dateRange: { start: null, end: null },
    departments: [],
    processTypes: [],
    users: [],
    status: [],
  });

  const allData = useMemo(
    () => uploadedFiles.filter((f) => f.status === 'success' && f.data).map((f) => f.data!),
    [uploadedFiles]
  );

  const filteredData = useMemo(() => Statistics.filterData(allData, filters), [allData, filters]);

  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return null;
    }

    return {
      overall: Statistics.calculateOverallStats(filteredData),
      departments: Statistics.calculateDepartmentStats(filteredData),
      processes: Statistics.calculateProcessStats(filteredData),
      users: Statistics.calculateUserStats(filteredData),
      trend: Statistics.calculateTrend(filteredData, trendPeriod),
      bottlenecks: Statistics.calculateBottlenecks(filteredData),
    };
  }, [filteredData, trendPeriod]);

  const filterOptions = useMemo(() => Statistics.getFilterOptions(allData), [allData]);

  const handleClear = () => {
    // Clear large objects to prevent memory leaks
    uploadedFiles.forEach((f) => {
      if (f.data) {
        (f as { data?: unknown }).data = undefined;
      }
    });
    setUploadedFiles([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Business Process Analytics</h1>
          <p className="mt-2 text-sm text-gray-600">
            Upload and analyze process execution data from User Executor
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* File Upload Section */}
        {uploadedFiles.length === 0 && (
          <FileUpload
            onFilesUploaded={(files) => {
              setIsLoading(true);
              setUploadedFiles((prev) => [...prev, ...files]);
              setIsLoading(false);
            }}
            isLoading={isLoading}
          />
        )}

        {/* Upload Progress and Analytics */}
        {uploadedFiles.length > 0 && (
          <>
            <UploadProgress files={uploadedFiles} onClear={handleClear} />

            {stats && (
              <div className="space-y-6 mt-6">
                {/* Overall Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Processes"
                    value={stats.overall.totalProcesses}
                    color="blue"
                  />
                  <StatCard
                    title="Completed"
                    value={stats.overall.totalCompleted}
                    subtitle={`${((stats.overall.totalCompleted / stats.overall.totalProcesses) * 100).toFixed(1)}% completion rate`}
                    color="green"
                  />
                  <StatCard
                    title="In Progress"
                    value={stats.overall.totalInProgress}
                    color="orange"
                  />
                  <StatCard
                    title="Avg Completion Time"
                    value={`${stats.overall.avgCompletionTime.toFixed(1)}h`}
                    subtitle="Per process"
                    color="purple"
                  />
                </div>

                {/* Filters and Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Filter Panel (Left Sidebar) */}
                  <div className="lg:col-span-1">
                    <FilterPanel
                      filters={filters}
                      onFilterChange={setFilters}
                      departments={filterOptions.departments}
                      processTypes={filterOptions.processTypes}
                      users={filterOptions.users}
                    />
                  </div>

                  {/* Charts (Main Content) */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Department and Process Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <DepartmentChart data={stats.departments} />
                      <ProcessChart data={stats.processes} />
                    </div>

                    {/* Trend Chart with Period Selector */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Completion Trend</h3>
                        <div className="flex gap-2">
                          {(['day', 'week', 'month'] as const).map((period) => (
                            <button
                              key={period}
                              onClick={() => setTrendPeriod(period)}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                trendPeriod === period
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {period.charAt(0).toUpperCase() + period.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <TrendChart data={stats.trend} />
                    </div>

                    {/* Bottleneck Chart */}
                    <BottleneckChart data={stats.bottlenecks} />
                  </div>
                </div>

                {/* User Performance Table */}
                <UserTable users={stats.users} />

                {/* Export Buttons */}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => exportDepartmentStats(stats.departments)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Export Department Stats
                  </button>
                  <button
                    onClick={() => exportUserStats(stats.users)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Export User Stats
                  </button>
                  <button
                    onClick={() =>
                      exportOverallStats(
                        stats.overall,
                        stats.departments,
                        stats.processes
                      )
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Export Overall Report
                  </button>
                  <button
                    onClick={() => printReport()}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Print Report
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;