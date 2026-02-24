'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useJobs } from '@/contexts/JobsContext';
import { Button } from '@/components/ui/button';
import { JobCard } from '@/components/ui/job-card';
import { useRouter } from 'next/navigation';

import { useContent } from '@/contexts/ContentContext';
import { useBlogs } from '@/contexts/BlogContext';
import { FileText, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const { t, language } = useLanguage();
  const { jobs } = useJobs();
  const { content } = useContent();
  const router = useRouter();

  // Load stats from content
  const statCompanies = content['stat_companies']?.content_en || '80+';
  const statHires = content['stat_hires']?.content_en || '2,500+';

  // Only show the first 3 active jobs on the homepage
  const featuredJobs = jobs.filter(j => j.status === 'published').slice(0, 3);

  // Show first 3 published blogs
  const { blogs } = useBlogs();
  const featuredBlogs = blogs.filter(b => b.is_published).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A3B5F] via-[#1A3B5F] to-[#00A3A3] opacity-95"></div>
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative container mx-auto px-4 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-lg lg:text-xl text-white/90 mb-10">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="shadow-lg" onClick={() => router.push('/jobs')}>
                {t('browseJobs')}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-[#00A3A3] hover:border-[#00A3A3] hover:text-white" onClick={() => router.push('/post-job')}>
                {t('postJobBtn')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-xl p-6 text-center">
            <div className="text-4xl font-black text-[#00A3A3] mb-2">{jobs.filter(j => j.status === 'published').length}+</div>
            <div className="text-gray-600 font-semibold">{t('activeJobs')}</div>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-6 text-center">
            <div className="text-4xl font-black text-[#1A3B5F] mb-2">{statCompanies}</div>
            <div className="text-gray-600 font-semibold">{t('companiesHiring')}</div>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-6 text-center">
            <div className="text-4xl font-black text-[#00A3A3] mb-2">{statHires}</div>
            <div className="text-gray-600 font-semibold">{t('successfulHires')}</div>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="container mx-auto px-4 lg:px-8 mt-16 mb-20" id="jobs">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-[#1A3B5F]">
            {t('jobs')}
          </h2>
          <Button variant="ghost" onClick={() => router.push('/jobs')}>
            {t('showMore')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map(job => (
            <JobCard key={job.id} job={job} onClick={() => router.push(`/jobs/${job.id}`)} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button size="lg" variant="outline" onClick={() => router.push('/jobs')}>
            {t('browseJobs')}
          </Button>
        </div>
      </div>

      {/* Latest Blog Posts */}
      {featuredBlogs.length > 0 && (
        <div className="bg-gray-50 py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-[#1A3B5F]">
                {t('blog')}
              </h2>
              <Button variant="ghost" onClick={() => router.push('/blog')}>
                {t('showMore') || 'عرض المزيد'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBlogs.map(post => (
                <div key={post.id} onClick={() => router.push(`/blog/${post.slug}`)} className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="bg-gray-100 h-48 flex items-center justify-center w-full">
                    {post.image_url ? (
                      <img src={post.image_url} alt={language === 'ar' ? post.title_ar : post.title_en} className="w-full h-full object-cover" />
                    ) : (
                      <FileText size={48} className="text-gray-300" />
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-xs text-[#00A3A3] font-bold mb-2">{new Date(post.created_at).toLocaleDateString()}</div>
                    <h3 className="text-xl font-bold text-[#1A3B5F] mb-3">{language === 'ar' ? post.title_ar : post.title_en}</h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3 flex-grow">
                      {(language === 'ar' ? post.content_ar : post.content_en)?.replace(/<[^>]+>/g, '')}
                    </p>
                    <div className="mt-auto text-[#00A3A3] font-bold flex items-center gap-1 text-sm">
                      اقرأ المزيد <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button size="lg" variant="outline" onClick={() => router.push('/blog')}>
                تصفح المدونة
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
