import JobFormPage from '../../components/sections/recruiterJobs/JobFormPage.jsx';
import JobPreviewPage from '../../components/sections/recruiterJobs/JobPreviewPage.jsx';
import PostingDetailPage from '../../components/sections/recruiterJobs/PostingDetailPage.jsx';

/* Routed pages of the recruiter job flows (Figma "Recruiter - Job Postings" 10103:59491); the URL states are listed in wiki/recruiter-job-postings.md. */
export const CreateJobPage = () => <JobFormPage mode="job" />;
export const BuildTemplatePage = () => <JobFormPage mode="template" />;
export const EditPostingPage = () => <JobFormPage mode="edit" />;
export const TemplatePreviewPage = () => <JobPreviewPage variant="template" />;
export const JobPreviewBeforePublishPage = () => <JobPreviewPage variant="publish" />;
export const PostingDetailRoute = () => <PostingDetailPage />;
