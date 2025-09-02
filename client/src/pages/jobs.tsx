import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Navbar } from '@/components/job-portal/navbar';
import {
  Search,
  MapPin,
  Clock,
  Building,
  ExternalLink,
  Users,
  Calendar,
  DollarSign,
  Share2,
  MessageCircle,
  Instagram,
  Send,
  CheckCircle,
  Eye,
  Linkedin,
  Mail,
  Youtube,
  X
} from 'lucide-react';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';
import type { Job, Company } from '@shared/schema';

type JobWithCompany = Job & { company: Company };

// Footer component updated to display "Ram Job Portal 2025 All rights reserved"
const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Ram Job Portal</h3>
            <p className="text-gray-300 mb-4">
              Your gateway to amazing career opportunities. Connect with top companies and find your dream job.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/jobs" className="text-gray-300 hover:text-white transition-colors">Browse Jobs</a></li>
              <li><a href="/companies" className="text-gray-300 hover:text-white transition-colors">Companies</a></li>
              <li><a href="/courses" className="text-gray-300 hover:text-white transition-colors">Courses</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Social Media & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.linkedin.com/in/ramdegala/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#0077B5] hover:bg-[#005A8D] rounded-full transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a
                href="mailto:ramdegala9@gmail.com"
                className="p-2 bg-[#EA4335] hover:bg-[#C53929] rounded-full transition-colors"
                title="Gmail"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.youtube.com/@yourchannel" // Replace with actual YouTube URL
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#FF0000] hover:bg-[#CC0000] rounded-full transition-colors"
                title="YouTube"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.twitter.com/yourhandle" // Replace with actual Twitter URL
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#1DA1F2] hover:bg-[#1488D8] rounded-full transition-colors"
                title="Twitter"
              >
                <X className="w-5 h-5 text-white" />
              </a>
            </div>
            <p className="text-gray-300 text-sm">
              Email: ramdegala9@gmail.com
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8 text-center">
          <p className="text-gray-400">&copy; 2025 Ram Job Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const getLevelColor = (level: string) => {
    switch (level) {
      case 'entry': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'mid': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'senior': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCompanyImage = (companyName: string) => {
    const name = companyName.toLowerCase();

    // Major tech companies
    if (name.includes('tcs') || name.includes('tata consultancy')) return '/images/tcs-logo.png';
    if (name.includes('infosys')) return '/images/infosys-logo.png';
    if (name.includes('microsoft')) return '/images/microsoft-logo.png';
    if (name.includes('google')) return '/images/google-logo.png';
    if (name.includes('amazon')) return '/images/amazon-logo.png';
    if (name.includes('akamai')) return 'https://logo.clearbit.com/akamai.com';
    if (name.includes('honeywell')) return 'https://logo.clearbit.com/honeywell.com';
    if (name.includes('wipro')) return 'https://logo.clearbit.com/wipro.com';
    if (name.includes('cognizant')) return 'https://logo.clearbit.com/cognizant.com';
    if (name.includes('accenture')) return 'https://logo.clearbit.com/accenture.com';
    if (name.includes('capgemini')) return 'https://logo.clearbit.com/capgemini.com';
    if (name.includes('oracle')) return 'https://logo.clearbit.com/oracle.com';
    if (name.includes('ibm')) return 'https://logo.clearbit.com/ibm.com';
    if (name.includes('salesforce')) return 'https://logo.clearbit.com/salesforce.com';
    if (name.includes('adobe')) return 'https://logo.clearbit.com/adobe.com';
    if (name.includes('nvidia')) return 'https://logo.clearbit.com/nvidia.com';
    if (name.includes('intel')) return 'https://logo.clearbit.com/intel.com';
    if (name.includes('cisco')) return 'https://logo.clearbit.com/cisco.com';
    if (name.includes('facebook') || name.includes('meta')) return 'https://logo.clearbit.com/meta.com';
    if (name.includes('apple')) return 'https://logo.clearbit.com/apple.com';
    if (name.includes('netflix')) return 'https://logo.clearbit.com/netflix.com';
    if (name.includes('uber')) return 'https://logo.clearbit.com/uber.com';
    if (name.includes('airbnb')) return 'https://logo.clearbit.com/airbnb.com';
    if (name.includes('spotify')) return 'https://logo.clearbit.com/spotify.com';
    if (name.includes('twitter')) return 'https://logo.clearbit.com/twitter.com';
    if (name.includes('linkedin')) return 'https://logo.clearbit.com/linkedin.com';
    if (name.includes('slack')) return 'https://logo.clearbit.com/slack.com';
    if (name.includes('zoom')) return 'https://logo.clearbit.com/zoom.us';
    if (name.includes('dropbox')) return 'https://logo.clearbit.com/dropbox.com';
    if (name.includes('github')) return 'https://logo.clearbit.com/github.com';
    if (name.includes('atlassian')) return 'https://logo.clearbit.com/atlassian.com';
    if (name.includes('hcl')) return '/images/hcl-logo.png'; // Added HCL logo

    // For companies without logos, return a styled background with initials
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
    const colorIndex = companyName.length % colors.length;

    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="${colors[colorIndex]}"/>
        <text x="24" y="30" text-anchor="middle" fill="white" font-size="16" font-weight="bold" font-family="Arial, sans-serif">
          ${companyName.substring(0, 2).toUpperCase()}
        </text>
      </svg>
    `)}`;
  };



const getExperienceBadgeColor = (level: string) => {
  switch (level) {
    case 'fresher': return 'bg-green-500 text-white';
    case 'experienced': return 'bg-blue-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export default function Jobs() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const { data: allJobs = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/jobs'],
    staleTime: 0, // Always refetch when component mounts
    refetchOnMount: true,
  });

  // Refetch jobs when component mounts or tab becomes active
  useEffect(() => {
    refetch();
  }, [refetch]);

  const { data: applications = [] } = useQuery({
    queryKey: ['/api/applications/user', user.id],
    enabled: !!user.id,
  });

  useEffect(() => {
    if (Array.isArray(applications) && applications.length > 0) {
      const appliedJobIds = applications.map((app: any) => app.jobId);
      setAppliedJobs(appliedJobIds);
    }
  }, [applications]);

  const filteredJobs = Array.isArray(allJobs) ? allJobs.filter((job: JobWithCompany) => {
    const matchesSearch = searchTerm === '' ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = locationFilter === '' ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());

    const now = new Date();
    const closingDate = new Date(job.closingDate);
    const isExpired = closingDate < now;
    const isExpiredRecently = (now.getTime() - closingDate.getTime()) <= (48 * 60 * 60 * 1000);

    switch (activeTab) {
      case 'fresher':
        return matchesSearch && matchesLocation && job.experienceLevel === 'fresher' && !isExpired;
      case 'experienced':
        return matchesSearch && matchesLocation && job.experienceLevel === 'experienced' && !isExpired;
      case 'expired':
        return matchesSearch && matchesLocation && (isExpired || !job.isActive);
      default:
        return matchesSearch && matchesLocation && !isExpired && job.isActive;
    }
  }) : [];

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleShare = (e: React.MouseEvent, job: JobWithCompany, platform: string) => {
    e.stopPropagation();
    const jobUrl = `${window.location.origin}/jobs/${job.id}`;
    const text = `Check out this job: ${job.title} at ${job.company.name}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + jobUrl)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(jobUrl)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't have direct link sharing, so copy to clipboard
        navigator.clipboard.writeText(jobUrl);
        alert('Link copied to clipboard! You can paste it on Instagram.');
        break;
      case 'gmail':
        window.location.href = `mailto:?subject=${encodeURIComponent(job.title)}&body=${encodeURIComponent(text + ' ' + jobUrl)}`;
        break;
      default:
        navigator.clipboard.writeText(jobUrl);
        alert('Link copied to clipboard!');
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now.getTime() - posted.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Less than 1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Job Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search jobs, companies, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-jobs"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10"
                  data-testid="search-location"
                />
              </div>
            </div>
            <Button data-testid="search-button">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Job Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 sm:mb-8">
            <TabsTrigger value="all" data-testid="tab-all-jobs" onClick={() => navigate('/jobs?tab=all')}>All Jobs</TabsTrigger>
            <TabsTrigger value="fresher" data-testid="tab-fresher-jobs" onClick={() => navigate('/jobs?tab=fresher')}>Fresher Jobs</TabsTrigger>
            <TabsTrigger value="experienced" data-testid="tab-experienced-jobs" onClick={() => navigate('/jobs?tab=experienced')}>Experienced Jobs</TabsTrigger>
            <TabsTrigger value="expired" data-testid="tab-expired-jobs" onClick={() => navigate('/jobs?tab=expired')}>Expired Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid gap-6">
              {filteredJobs.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <Users className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600">
                      {activeTab === 'expired'
                        ? 'No expired jobs in your search criteria.'
                        : 'Try adjusting your search criteria or check back later for new opportunities.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredJobs.map((job: JobWithCompany) => {
                  const isApplied = appliedJobs.includes(job.id);
                  const isExpired = new Date(job.closingDate) < new Date();

                  return (
                    <Card
                      key={job.id}
                      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 mx-2 sm:mx-0"
                      onClick={() => handleJobClick(job.id)}
                      data-testid={`job-card-${job.id}`}
                    >
                      <CardContent className="p-4 sm:p-6">
                        {/* Header Section */}
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start flex-1">
                              <div className="company-logo-container w-16 h-16 mr-4 flex items-center justify-center bg-white rounded-lg border shadow-sm">
                                <img
                                  src={getCompanyImage(job.company.name)}
                                  alt={`${job.company.name} logo`}
                                  className="w-12 h-12 object-contain rounded-md"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `data:image/svg+xml,${encodeURIComponent(`
                                      <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="48" height="48" rx="8" fill="#3B82F6"/>
                                        <text x="24" y="30" text-anchor="middle" fill="white" font-size="16" font-weight="bold">
                                          ${job.company.name.substring(0, 2).toUpperCase()}
                                        </text>
                                      </svg>
                                    `)}`;
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                                  {job.title}
                                </CardTitle>
                                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{job.company.name}</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {job.location}
                                </p>
                              </div>
                            </div>
                            <Badge className={getLevelColor(job.experienceLevel)}>
                              {job.experienceLevel}
                            </Badge>
                          </div>
                        </CardHeader>

                        {/* Salary & Experience Section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                            <div className="text-green-600 font-semibold text-lg">
                              {job.salary}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Users className="w-4 h-4 mr-1" />
                              <span className="text-sm">{job.experienceMin}-{job.experienceMax} years</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                Closes: {new Date(job.closingDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {/* Removed duplicate experience badge here */}
                        </div>

                        {/* Skills Section */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.split(',').slice(0, 6).map((skill, index) => (
                            <Badge key={index} variant="outline" className="badge text-xs px-2 py-1">
                              {skill.trim()}
                            </Badge>
                          ))}
                          {job.skills.split(',').length > 6 && (
                            <Badge variant="outline" className="badge text-xs px-2 py-1">
                              +{job.skills.split(',').length - 6} more
                            </Badge>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 space-y-3 sm:space-y-0">
                          <div className="flex items-center space-x-3">
                            {/* Share Buttons */}
                            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                              <button
                                onClick={(e) => handleShare(e, job, 'whatsapp')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                title="Share on WhatsApp"
                                data-testid={`share-whatsapp-${job.id}`}
                              >
                                <FaWhatsapp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleShare(e, job, 'telegram')}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Share on Telegram"
                                data-testid={`share-telegram-${job.id}`}
                              >
                                <FaTelegram className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleShare(e, job, 'instagram')}
                                className="p-2 text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                                title="Share on Instagram"
                                data-testid={`share-instagram-${job.id}`}
                              >
                                <Instagram className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleShare(e, job, 'gmail')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Share via Gmail"
                                data-testid={`share-gmail-${job.id}`}
                              >
                                <Mail className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleShare(e, job, 'copy')}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                                title="Copy Link"
                                data-testid={`share-copy-${job.id}`}
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                            {isApplied && (
                              <span className="text-sm text-green-600 font-medium">Applied</span>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJobClick(job.id);
                              }}
                              className="flex items-center space-x-2"
                              data-testid={`view-details-${job.id}`}
                            >
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                            </Button>
                            {!isApplied && !isExpired && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (job.applyUrl) {
                                    window.open(job.applyUrl, '_blank');
                                  } else {
                                    handleJobClick(job.id);
                                  }
                                }}
                                className="bg-blue-600 hover:bg-blue-700"
                                data-testid={`apply-now-${job.id}`}
                              >
                                Apply Now
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      

      <Footer />
    </div>
  );
}