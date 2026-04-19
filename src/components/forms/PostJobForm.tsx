'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2, UploadCloud } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { PRICING } from '@/lib/stripe'
import { formatCurrency } from '@/lib/utils'

const roleSchema = z.object({
  title: z.string().min(3, 'Title needs to be at least 3 characters'),
  job_type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  location: z.string().min(2, 'Location is required'),
  is_remote: z.boolean(),
  salary_min: z.number().optional().or(z.literal('')),
  salary_max: z.number().optional().or(z.literal('')),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  apply_url: z.string().url('Must be a valid URL'),
  contact_email: z.string().email('Invalid contact email'),
})

const companySchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  company_website: z.string().url().optional().or(z.literal('')),
})

type FormValues = z.infer<typeof roleSchema> & z.infer<typeof companySchema>

export function PostJobForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [previewMode, setPreviewMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<FormValues>({
    resolver: zodResolver(step === 1 ? roleSchema : companySchema) as any,
    defaultValues: {
      is_remote: false,
    }
  })

  // Hacky workarounds due to shadcn wrapper not passing full ref properly for some elements 
  // Normally use Controller from react-hook-form, but doing manual sync for brevity
  const description = watch('description') || ''

  const nextStep = async () => {
    let isValid = false
    if (step === 1) {
      isValid = await trigger(['title', 'job_type', 'location', 'description', 'apply_url', 'contact_email'])
    } else if (step === 2) {
      isValid = await trigger(['company_name'])
      if (isValid && !logoFile) {
        // Logo is somewhat optional but we encourage it
      }
    }

    if (isValid) {
      setStep((s) => (s + 1) as 1 | 2 | 3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    setStep((s) => (s - 1) as 1 | 2 | 3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 2 * 1024 * 1024) {
        alert('File is too large. Max 2MB.')
        return
      }
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const submitJob = async (plan: 'single' | 'bundle' | 'featured') => {
    setIsSubmitting(true)
    setFormError('')

    try {
      const data = watch()
      let company_logo_url = ''

      // 1. Upload logo if exists
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(fileName, logoFile)

        if (uploadError) throw new Error('Failed to upload logo: ' + uploadError.message)
        
        const { data: publicUrl } = supabase.storage
          .from('logos')
          .getPublicUrl(fileName)
          
        company_logo_url = publicUrl.publicUrl
      }

      // 2. Create job via API endpoint
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          salary_min: data.salary_min ? Number(data.salary_min) : null,
          salary_max: data.salary_max ? Number(data.salary_max) : null,
          company_logo_url: company_logo_url || null,
        }),
      })

      const jobData = await res.json()
      if (!res.ok) throw new Error(jobData.error || 'Failed to create job')

      // 3. Create checkout session
      const stripeRes = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: jobData.jobId,
          plan,
        }),
      })

      const stripeData = await stripeRes.json()
      if (!stripeRes.ok) throw new Error(stripeData.error || 'Failed to init checkout')

      // 4. Redirect to stripe
      window.location.href = stripeData.url

    } catch (err: any) {
      console.error(err)
      setFormError(err.message || 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Steps indicator */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-200 -z-10" />
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
              s === step
                ? 'bg-primary-700 text-white'
                : s < step
                ? 'bg-slate-900 text-white'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {step === 1 && (
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 1: Role Details</h2>
              <p className="text-slate-500 text-sm">Tell candidates about the opportunity.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title <span className="text-red-500">*</span></Label>
                <Input id="title" {...register('title')} placeholder="e.g. Senior Solar Engineer" />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Job Type <span className="text-red-500">*</span></Label>
                  <Select 
                    onValueChange={(val) => {
                      setValue('job_type', val as any)
                      trigger('job_type')
                    }} 
                    defaultValue={watch('job_type')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.job_type && <p className="text-sm text-red-500 mt-1">{errors.job_type.message}</p>}
                </div>
                <div>
                  <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                  <Input id="location" {...register('location')} placeholder="e.g. San Francisco, CA" />
                  {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="remote" 
                  checked={watch('is_remote')} 
                  onCheckedChange={(val: boolean) => setValue('is_remote', val)} 
                />
                <Label htmlFor="remote" className="font-normal">This is a remote position</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary_min">Min Salary (USD) <span className="text-slate-400 font-normal">Optional</span></Label>
                  <Input id="salary_min" type="number" {...register('salary_min', { valueAsNumber: true })} placeholder="e.g. 100000" />
                </div>
                <div>
                  <Label htmlFor="salary_max">Max Salary (USD) <span className="text-slate-400 font-normal">Optional</span></Label>
                  <Input id="salary_max" type="number" {...register('salary_max', { valueAsNumber: true })} placeholder="e.g. 150000" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="description">Job Description <span className="text-red-500">*</span></Label>
                  <button 
                    type="button" 
                    onClick={() => setPreviewMode(!previewMode)}
                    className="text-sm text-primary-700 hover:text-primary-800"
                  >
                    {previewMode ? 'Edit Mode' : 'Preview Markdown'}
                  </button>
                </div>
                {previewMode ? (
                  <div className="prose prose-sm max-w-none border rounded-md p-4 min-h-[200px] bg-slate-50">
                    <ReactMarkdown>{description || '*No description provided*'}</ReactMarkdown>
                  </div>
                ) : (
                  <Textarea 
                    id="description" 
                    {...register('description')} 
                    placeholder="We are looking for..." 
                    className="min-h-[200px]"
                  />
                )}
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <Label htmlFor="apply_url">Application URL <span className="text-red-500">*</span></Label>
                <Input id="apply_url" type="url" {...register('apply_url')} placeholder="https://..." />
                <p className="text-xs text-slate-500 mt-1">Where candidates should go to apply</p>
                {errors.apply_url && <p className="text-sm text-red-500 mt-1">{errors.apply_url.message}</p>}
              </div>

              <div>
                <Label htmlFor="contact_email">Contact Email <span className="text-red-500">*</span></Label>
                <Input id="contact_email" type="email" {...register('contact_email')} placeholder="hiring@company.com" />
                <p className="text-xs text-slate-500 mt-1">For our team to reach out to you. Not shown publicly.</p>
                {errors.contact_email && <p className="text-sm text-red-500 mt-1">{errors.contact_email.message}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={nextStep} className="bg-primary-700 hover:bg-primary-800">
                Continue to Company Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-6 md:p-8 space-y-6">
            <button onClick={prevStep} className="text-sm text-slate-500 flex items-center hover:text-slate-900 mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>
            
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 2: Company Details</h2>
              <p className="text-slate-500 text-sm">Tell candidates who they will be working for.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="company_name">Company Name <span className="text-red-500">*</span></Label>
                <Input id="company_name" {...register('company_name')} placeholder="Company Inc." />
                {errors.company_name?.message && <p className="text-sm text-red-500 mt-1">{String(errors.company_name.message)}</p>}
              </div>

              <div>
                <Label htmlFor="company_website">Company Website <span className="text-slate-400 font-normal">Optional</span></Label>
                <Input id="company_website" type="url" {...register('company_website')} placeholder="https://..." />
              </div>

              <div>
                <Label>Company Logo <span className="text-slate-400 font-normal">Optional, but highly recommended</span></Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-100 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center">
                    {logoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoPreview} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <UploadCloud className="w-8 h-8 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <input 
                      type="file" 
                      id="logo" 
                      accept="image/png, image/jpeg, image/webp" 
                      className="hidden" 
                      onChange={handleLogoUpload}
                    />
                    <Label 
                      htmlFor="logo" 
                      className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                    >
                      Choose file
                    </Label>
                    <p className="text-xs text-slate-500 mt-1">JPEG, PNG, WEBP max 2MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={nextStep} className="bg-primary-700 hover:bg-primary-800">
                Continue to Pricing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-6 md:p-8 space-y-6">
            <button onClick={prevStep} className="text-sm text-slate-500 flex items-center hover:text-slate-900 mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>

            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 3: Choose Plan & Post</h2>
              <p className="text-slate-500 text-sm">Your job will be reviewed and published within 24 hours.</p>
            </div>

            {formError && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Single Post */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col hover:border-primary-400 transition-colors">
                <h3 className="font-semibold text-lg">{PRICING.single.label}</h3>
                <p className="text-3xl font-bold my-2">{formatCurrency(PRICING.single.amount)}</p>
                <p className="text-sm text-slate-500 mb-6 flex-1">{PRICING.single.description}</p>
                <Button 
                  onClick={() => submitJob('single')} 
                  disabled={isSubmitting}
                  variant="outline"
                  className="w-full"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Select Plan'}
                </Button>
              </div>

              {/* Bundle */}
              <div className="border border-slate-200 rounded-xl p-5 flex flex-col hover:border-primary-400 transition-colors">
                <h3 className="font-semibold text-lg">{PRICING.bundle.label}</h3>
                <p className="text-3xl font-bold my-2">{formatCurrency(PRICING.bundle.amount)}</p>
                <p className="text-sm text-slate-500 mb-6 flex-1">{PRICING.bundle.description}</p>
                <Button 
                  onClick={() => submitJob('bundle')} 
                  disabled={isSubmitting}
                  variant="outline"
                  className="w-full"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Select Plan'}
                </Button>
              </div>

              {/* Featured */}
              <div className="border border-amber-300 bg-amber-50 rounded-xl p-5 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-400 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-bl-lg">
                  Recommended
                </div>
                <h3 className="font-semibold text-lg">{PRICING.featured.label}</h3>
                <p className="text-3xl font-bold my-2 text-amber-900">{formatCurrency(PRICING.featured.amount)}</p>
                <p className="text-sm text-slate-600 mb-6 flex-1">{PRICING.featured.description}</p>
                <Button 
                  onClick={() => submitJob('featured')} 
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Select Plan'}
                </Button>
              </div>
            </div>
            
            <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
              Payments are securely processed by Stripe.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
