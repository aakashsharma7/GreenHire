'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function JobFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [jobType, setJobType] = useState(searchParams.get('job_type') || 'all')
  const [isRemote, setIsRemote] = useState(searchParams.get('is_remote') === 'true')
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const updateURL = useCallback(
    (params: {
      search?: string
      job_type?: string
      is_remote?: boolean
      sort?: string
    }) => {
      const current = new URLSearchParams()
      if (params.search) current.set('search', params.search)
      if (params.job_type && params.job_type !== 'all') current.set('job_type', params.job_type)
      if (params.is_remote) current.set('is_remote', 'true')
      if (params.sort && params.sort !== 'featured') current.set('sort', params.sort)
      router.push(`/?${current.toString()}`)
    },
    [router]
  )

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL({ search, job_type: jobType, is_remote: isRemote, sort })
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleJobTypeChange = (value: string | null) => {
    if (!value) return
    setJobType(value)
    updateURL({ search, job_type: value, is_remote: isRemote, sort })
  }

  const handleRemoteToggle = () => {
    const newRemote = !isRemote
    setIsRemote(newRemote)
    updateURL({ search, job_type: jobType, is_remote: newRemote, sort })
  }

  const handleSortChange = (value: string | null) => {
    if (!value) return
    setSort(value)
    updateURL({ search, job_type: jobType, is_remote: isRemote, sort: value })
  }

  const clearFilters = () => {
    setSearch('')
    setJobType('all')
    setIsRemote(false)
    setSort('featured')
    router.push('/')
  }

  const hasActiveFilters = search || jobType !== 'all' || isRemote || sort !== 'featured'

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search jobs, companies, or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-slate-50 border-slate-200 focus:bg-white focus:border-primary-500 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Desktop filters row */}
      <div className="hidden md:flex items-center gap-3 flex-wrap">
        <Select value={jobType} onValueChange={handleJobTypeChange}>
          <SelectTrigger className="w-40 bg-slate-50 border-slate-200 text-sm">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>

        <button
          onClick={handleRemoteToggle}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
            isRemote
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          🌎 Remote Only
        </button>

        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-40 bg-slate-50 border-slate-200 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured First</SelectItem>
            <SelectItem value="latest">Latest First</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-slate-500 hover:text-slate-700 text-sm"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Mobile filter toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {filtersOpen ? 'Hide filters' : 'Show filters'}
          {hasActiveFilters && (
            <span className="ml-1 w-2 h-2 rounded-full bg-primary-600" />
          )}
        </button>

        {filtersOpen && (
          <div className="mt-3 space-y-3">
            <Select value={jobType} onValueChange={handleJobTypeChange}>
              <SelectTrigger className="w-full bg-slate-50 border-slate-200 text-sm">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={handleRemoteToggle}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium border text-left transition-all duration-150 ${
                isRemote
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              🌎 Remote Only
            </button>

            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full bg-slate-50 border-slate-200 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured First</SelectItem>
                <SelectItem value="latest">Latest First</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-slate-500 hover:text-slate-700 text-sm w-full"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
