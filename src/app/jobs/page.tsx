'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronDown, Heart, ArrowUpRight } from 'lucide-react';

const MOCK_JOBS = [
  {
    id: 1,
    title: 'Senior Battery Systems Engineer',
    company: 'TerraForm Energy',
    logo: 'T',
    logoBg: 'bg-emerald-500/10 text-emerald-500',
    location: 'San Francisco, CA',
    featured: true,
    urgentlyHiring: false,
    jobType: 'Full-time',
    remote: 'Hybrid',
    experience: 'Senior',
    department: 'Engineering',
    salaryMin: 150000,
    salaryMax: 190000,
    salaryString: '$150k – $190k',
    datePosted: '2 days ago'
  },
  {
    id: 2,
    title: 'Carbon Modeling Data Scientist',
    company: 'BioCarbon',
    logo: 'B',
    logoBg: 'bg-blue-500/10 text-blue-500',
    location: 'Remote',
    featured: false,
    urgentlyHiring: true,
    jobType: 'Full-time',
    remote: 'Remote',
    experience: 'Mid-level',
    department: 'Engineering',
    salaryMin: 130000,
    salaryMax: 160000,
    salaryString: '$130k – $160k',
    datePosted: '1 week ago'
  },
  {
    id: 3,
    title: 'Head of Growth Marketing',
    company: 'EcoGrid Solutions',
    logo: 'E',
    logoBg: 'bg-orange-500/10 text-orange-500',
    location: 'New York, NY',
    featured: false,
    urgentlyHiring: false,
    jobType: 'Full-time',
    remote: 'Hybrid',
    experience: 'Lead / manager',
    department: 'Marketing',
    salaryMin: 140000,
    salaryMax: 180000,
    salaryString: '$140k – $180k',
    datePosted: '3 days ago'
  },
  {
    id: 4,
    title: 'Sustainability Product Designer',
    company: 'SolarCity',
    logo: 'S',
    logoBg: 'bg-yellow-500/10 text-yellow-500',
    location: 'Austin, TX',
    featured: false,
    urgentlyHiring: false,
    jobType: 'Contract',
    remote: 'On-site',
    experience: 'Mid-level',
    department: 'Design',
    salaryMin: 90000,
    salaryMax: 120000,
    salaryString: '$90k – $120k',
    datePosted: '5 days ago'
  },
  {
    id: 5,
    title: 'Junior Solar Field Technician',
    company: 'ApexGreen',
    logo: 'A',
    logoBg: 'bg-accent-secondary/10 text-accent-secondary',
    location: 'Denver, CO',
    featured: false,
    urgentlyHiring: false,
    jobType: 'Full-time',
    remote: 'On-site',
    experience: 'Entry level',
    department: 'Engineering',
    salaryMin: 60000,
    salaryMax: 80000,
    salaryString: '$60k – $80k',
    datePosted: '2 weeks ago'
  },
  {
    id: 6,
    title: 'VP of Commercial Sales',
    company: 'WindPower Systems',
    logo: 'W',
    logoBg: 'bg-indigo-500/10 text-indigo-500',
    location: 'Chicago, IL',
    featured: true,
    urgentlyHiring: true,
    jobType: 'Full-time',
    remote: 'Remote',
    experience: 'Lead / manager',
    department: 'Sales',
    salaryMin: 180000,
    salaryMax: 240000,
    salaryString: '$180k – $240k+',
    datePosted: '1 day ago'
  },
  {
    id: 7,
    title: 'Climate Policy Analyst',
    company: 'TerraForm Energy',
    logo: 'T',
    logoBg: 'bg-emerald-500/10 text-emerald-500',
    location: 'Washington, DC',
    featured: false,
    urgentlyHiring: false,
    jobType: 'Part-time',
    remote: 'Hybrid',
    experience: 'Entry level',
    department: 'Product',
    salaryMin: 50000,
    salaryMax: 70000,
    salaryString: '$50k – $70k',
    datePosted: '4 days ago'
  }
];

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Remote'];
const EXPERIENCE_LEVELS = ['Entry level', 'Mid-level', 'Senior', 'Lead / manager'];
const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Product', 'Sales'];

export default function BrowseJobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const [activeJobTypes, setActiveJobTypes] = useState<string[]>([]);
  const [activeExperience, setActiveExperience] = useState<string[]>([]);
  const [activeDepartments, setActiveDepartments] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const toggleFilter = (set: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    set(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    setCurrentPage(1); // Reset to page 1 on filter
  };

  const handleChipClick = (chip: string) => {
    if (chip === 'All jobs') {
      setActiveJobTypes([]);
      setActiveExperience([]);
      setActiveDepartments([]);
    } else if (JOB_TYPES.includes(chip)) {
      toggleFilter(setActiveJobTypes, chip);
    } else if (EXPERIENCE_LEVELS.includes(chip)) {
      toggleFilter(setActiveExperience, chip);
    }
  };

  const isChipActive = (chip: string) => {
    if (chip === 'All jobs') return activeJobTypes.length === 0 && activeExperience.length === 0 && activeDepartments.length === 0;
    if (JOB_TYPES.includes(chip)) return activeJobTypes.includes(chip);
    if (EXPERIENCE_LEVELS.includes(chip)) return activeExperience.includes(chip);
    return false;
  };

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job => {
      const matchSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());

      const matchTypes = activeJobTypes.length === 0 || activeJobTypes.includes(job.jobType) || (activeJobTypes.includes('Remote') && job.remote === 'Remote');
      const matchExp = activeExperience.length === 0 || activeExperience.includes(job.experience);
      const matchDept = activeDepartments.length === 0 || activeDepartments.includes(job.department);

      return matchSearch && matchLocation && matchTypes && matchExp && matchDept;
    });
  }, [searchQuery, locationQuery, activeJobTypes, activeExperience, activeDepartments]);

  const currentJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredJobs, currentPage]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const getCount = (type: string, value: string) => {
    return MOCK_JOBS.filter(j => {
      if (type === 'jobType') return j.jobType === value || (value === 'Remote' && j.remote === 'Remote');
      if (type === 'experience') return j.experience === value;
      if (type === 'department') return j.department === value;
      return false;
    }).length;
  };

  return (
    <div className="pt-32 pb-20 max-w-[1200px] mx-auto px-6">

      {/* Top bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1 text-white">Browse jobs</h1>
          <p className="text-text-secondary text-sm font-medium">Discover your next opportunity</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border-subtle hover:bg-bg-elevated rounded-lg transition-colors text-sm font-medium text-text-primary">
          Job detail page <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Search row */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Job title, skill, or company..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full h-11 pl-10 pr-4 bg-bg-surface/50 border border-border-subtle rounded-xl text-sm outline-none focus:border-accent-primary transition-colors text-white placeholder-text-muted"
          />
        </div>
        <div className="relative md:w-64">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Location"
            value={locationQuery}
            onChange={(e) => { setLocationQuery(e.target.value); setCurrentPage(1); }}
            className="w-full h-11 pl-10 pr-4 bg-bg-surface/50 border border-border-subtle rounded-xl text-sm outline-none focus:border-accent-primary transition-colors text-white placeholder-text-muted"
          />
        </div>
        <button className="h-11 px-6 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm shrink-0">
          Search
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-10">
        {['All jobs', 'Remote', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Entry level'].map((chip) => {
          const active = isChipActive(chip);
          return (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${active
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-text-secondary border-border-subtle hover:bg-bg-elevated'
                }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-bg-surface/30 backdrop-blur-md border border-border-subtle rounded-xl p-5">
            <h2 className="font-display font-bold text-lg mb-6 text-white">Filters</h2>

            {/* Job Type */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-text-secondary tracking-wider uppercase mb-4">Job Type</h3>
              <div className="space-y-3">
                {JOB_TYPES.map((label) => (
                  <label key={label} onClick={() => toggleFilter(setActiveJobTypes, label)} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${activeJobTypes.includes(label)
                        ? 'bg-white border-white text-black'
                        : 'border-text-muted group-hover:border-white'
                        }`}>
                        {activeJobTypes.includes(label) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </div>
                      <span className={`text-sm select-none ${activeJobTypes.includes(label) ? 'text-white font-medium' : 'text-text-primary'}`}>{label}</span>
                    </div>
                    <span className="text-xs text-text-muted">{getCount('jobType', label)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-border-subtle mb-6" />

            {/* Experience */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-text-secondary tracking-wider uppercase mb-4">Experience</h3>
              <div className="space-y-3">
                {EXPERIENCE_LEVELS.map((label) => (
                  <label key={label} onClick={() => toggleFilter(setActiveExperience, label)} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${activeExperience.includes(label)
                        ? 'bg-white border-white text-black'
                        : 'border-text-muted group-hover:border-white'
                        }`}>
                        {activeExperience.includes(label) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </div>
                      <span className={`text-sm select-none ${activeExperience.includes(label) ? 'text-white font-medium' : 'text-text-primary'}`}>{label}</span>
                    </div>
                    <span className="text-xs text-text-muted">{getCount('experience', label)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-border-subtle mb-6" />

            {/* Department */}
            <div className="mb-2">
              <h3 className="text-xs font-bold text-text-secondary tracking-wider uppercase mb-4">Department</h3>
              <div className="space-y-3">
                {DEPARTMENTS.map((label) => (
                  <label key={label} onClick={() => toggleFilter(setActiveDepartments, label)} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${activeDepartments.includes(label)
                        ? 'bg-white border-white text-black'
                        : 'border-text-muted group-hover:border-white'
                        }`}>
                        {activeDepartments.includes(label) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </div>
                      <span className={`text-sm select-none ${activeDepartments.includes(label) ? 'text-white font-medium' : 'text-text-primary'}`}>{label}</span>
                    </div>
                    <span className="text-xs text-text-muted">{getCount('department', label)}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Job Feed */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium">
              <span className="text-white font-bold text-base">{filteredJobs.length}</span> <span className="text-text-secondary">jobs found</span>
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border-subtle rounded-lg text-sm font-medium hover:bg-bg-elevated transition-colors text-white">
              Most relevant <ChevronDown className="w-4 h-4 text-text-secondary" />
            </button>
          </div>

          <div className="space-y-4">

            {currentJobs.length === 0 ? (
              <div className="p-12 border border-border-subtle rounded-xl bg-bg-surface/30 backdrop-blur-md text-center">
                <p className="text-text-secondary mb-2">No jobs found matching your criteria.</p>
                <button onClick={() => handleChipClick('All jobs')} className="text-accent-primary hover:underline font-medium text-sm">Clear filters</button>
              </div>
            ) : (
              currentJobs.map((job) => (
                <div key={job.id} className={`p-6 rounded-xl border transition-colors bg-bg-surface/30 backdrop-blur-md ${job.featured ? 'border-accent-primary/50' : 'border-border-subtle hover:border-text-muted'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg shrink-0 ${job.logoBg}`}>
                        {job.logo}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          <h3 className="font-display font-bold text-lg text-white">{job.title}</h3>
                          {job.featured && <span className="px-2 py-0.5 rounded text-xs font-medium bg-accent-primary/20 text-accent-primary border border-accent-primary/20">Featured</span>}
                          {job.urgentlyHiring && <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Urgently hiring</span>}
                        </div>
                        <p className="text-sm text-text-secondary">{job.company} · {job.location}</p>
                      </div>
                    </div>
                    <button className="p-2.5 rounded-lg border border-border-subtle hover:bg-bg-elevated transition-colors text-text-secondary hover:text-white shrink-0 self-start sm:self-auto">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-bg-elevated border border-border-subtle text-text-primary">{job.jobType}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${job.remote === 'Remote' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-bg-elevated border-border-subtle text-text-primary'}`}>{job.remote}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-bg-elevated border border-border-subtle text-text-primary">{job.experience}</span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-start w-full sm:w-auto">
                      <div className="text-left sm:text-right">
                        <span className="text-white font-bold text-sm block sm:inline">{job.salaryString}</span>
                        <span className="text-xs text-text-muted sm:ml-3 block sm:inline mt-1 sm:mt-0">{job.datePosted}</span>
                      </div>
                      <button className="px-6 py-2 border border-text-muted text-white hover:bg-white hover:text-black hover:border-white transition-colors rounded-lg font-medium text-sm shrink-0">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 mb-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded border border-border-subtle hover:bg-bg-elevated disabled:opacity-50 disabled:hover:bg-transparent flex items-center justify-center transition-colors"
              >
                <ChevronDown className="w-4 h-4 rotate-90 text-text-secondary" />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded border font-medium text-sm flex items-center justify-center transition-colors ${currentPage === i + 1
                    ? 'border-white bg-white text-black'
                    : 'border-border-subtle hover:bg-bg-elevated text-text-secondary'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded border border-border-subtle hover:bg-bg-elevated disabled:opacity-50 disabled:hover:bg-transparent flex items-center justify-center transition-colors"
              >
                <ChevronDown className="w-4 h-4 -rotate-90 text-text-secondary" />
              </button>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
