import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editorial & Brands Policy | The Indian Berg',
  description: 'Our mission, editorial principles, and submission guidelines for articles and press releases.',
};

export default function BrandsPolicyPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto prose prose-zinc dark:prose-invert lg:prose-lg font-serif">
        <h1 className="font-sans font-black tracking-tight mb-8 text-4xl">The Indianberg Editorial Policy</h1>
        
        <section className="mb-12">
          <h2 className="font-sans font-bold">Our Mission</h2>
          <p>
            The Indianberg is an independent digital news publication committed to factual journalism, public interest reporting, business insights, technology coverage, policy analysis, startups, economy, and social impact stories.
          </p>
          <p>
            Our mission is to provide accurate, transparent, and responsible journalism that informs readers while maintaining the highest standards of editorial integrity.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-sans font-bold">Editorial Principles</h2>
          
          <h3>Accuracy and Verification</h3>
          <p>
            All published content must be based on verifiable facts. Our editorial team cross-checks information through reliable sources, official documents, public records, expert statements, and direct reporting wherever possible.
          </p>

          <h3>Editorial Independence</h3>
          <p>
            The Indianberg maintains complete editorial independence from advertisers, sponsors, political organizations, corporate entities, and external stakeholders. Editorial decisions are made solely by our editorial team.
          </p>

          <h3>Fairness and Balance</h3>
          <p>
            We strive to present stories fairly and provide relevant perspectives whenever applicable. News reports, analysis, and opinions are clearly distinguished.
          </p>

          <h3>Transparency</h3>
          <p>All articles must clearly display:</p>
          <ul>
            <li>Author Name</li>
            <li>Publication Date</li>
            <li>Updated Date (if applicable)</li>
            <li>Category</li>
            <li>Source Attribution</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="font-sans font-bold">Originality</h2>
          <p>
            The Indianberg does not permit plagiarism, copied content, or unauthorized reproduction of third-party materials. All contributors must submit original work.
          </p>

          <h3>Opinion and Editorial Content</h3>
          <p>
            Opinion articles represent the views of the author and not necessarily those of The Indianberg. Opinion content will be clearly labeled as: Opinion, Editorial, Analysis, or Expert View.
          </p>

          <h3>Sponsored Content</h3>
          <p>
            Sponsored content, advertorials, brand partnerships, and promotional materials must be clearly identified. Sponsored content does not influence editorial coverage.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-sans font-bold">Corrections Policy</h2>
          <p>
            If factual inaccuracies are discovered, corrections will be made promptly. Major corrections may include an Editor's Note explaining the update.
          </p>

          <h3>AI Usage Policy</h3>
          <p>
            AI tools may assist in research, transcription, grammar improvement, and formatting. However, all content published on The Indianberg must undergo human editorial review before publication.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="font-sans font-bold">Ethical Standards</h2>
          <p>The Indianberg does not publish:</p>
          <ul>
            <li>Hate speech</li>
            <li>Defamatory content</li>
            <li>Misinformation or false claims</li>
            <li>Plagiarized content</li>
            <li>Obscene or unlawful material</li>
            <li>Content promoting violence or discrimination</li>
          </ul>
        </section>

        <hr className="my-12 border-zinc-200 dark:border-zinc-800" />

        <h1 className="font-sans font-black tracking-tight mb-8 text-4xl">Article & Press Release Submission Guidelines</h1>
        <p className="lead">
          Thank you for your interest in contributing to The Indianberg. Please review the following requirements before submitting content.
        </p>

        <section className="mb-12">
          <h2 className="font-sans font-bold">Accepted Content Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <ul className="mt-0">
              <li>Business</li>
              <li>Startups</li>
              <li>Economy</li>
              <li>Technology</li>
              <li>Blockchain & Web3</li>
            </ul>
            <ul className="mt-0">
              <li>Finance</li>
              <li>Real Estate</li>
              <li>Healthcare</li>
              <li>Education</li>
            </ul>
            <ul className="mt-0">
              <li>Government Policy</li>
              <li>Leadership</li>
              <li>Innovation</li>
              <li>Opinion & Analysis</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-sans font-bold">Editorial Article Requirements</h2>
          <p>Editorial submissions should:</p>
          <ul>
            <li>Be original and unpublished.</li>
            <li>Contain 800–1500 words.</li>
            <li>Include proper references where applicable.</li>
            <li>Be factually accurate and avoid promotional language.</li>
            <li>Provide unique insights and analysis.</li>
          </ul>

          <h3 className="font-sans font-bold mt-8">Editorial Format</h3>
          <p>Include: Headline, Author Name, Author Bio (50–100 words), Article Body, Sources & References.</p>
        </section>

        <section className="mb-12">
          <h2 className="font-sans font-bold">Press Release Submission Requirements</h2>
          <p>Press releases should include:</p>
          <ul>
            <li>Clear headline and Dateline (City, State)</li>
            <li>Company or Organization Name</li>
            <li>Key Announcement and Supporting Quotes</li>
            <li>Media Contact Information and Official Website</li>
          </ul>

          <h3 className="font-sans font-bold mt-8">Press Release Standards</h3>
          <p>The Indianberg may reject press releases that contain:</p>
          <ul>
            <li>Misleading claims or unverified statistics</li>
            <li>Excessive promotional language</li>
            <li>Defamatory statements or legal violations</li>
          </ul>
          <p className="text-sm text-zinc-500 italic mt-4">
            Submission does not guarantee publication. Our editorial team reserves the right to edit, revise, shorten, or reject submissions.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-sans font-bold">Contributor Declaration</h2>
          <p>By submitting content to The Indianberg, the contributor confirms that:</p>
          <ul>
            <li>The content is original and does not infringe any copyright.</li>
            <li>The information provided is accurate to the best of their knowledge.</li>
            <li>The contributor grants The Indianberg the right to publish, edit, archive, and distribute the content.</li>
          </ul>
        </section>

        <div className="bg-zinc-100 dark:bg-zinc-900 p-6 md:p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 mt-12 not-prose">
          <h3 className="font-sans font-bold text-xl mb-4 text-black dark:text-white">Contact & Submissions</h3>
          <p className="mb-2 text-zinc-700 dark:text-zinc-300"><strong>Editorial Articles:</strong> Allow 3–7 Business Days for review.</p>
          <p className="mb-6 text-zinc-700 dark:text-zinc-300"><strong>Press Releases:</strong> Allow 24–72 Hours for review.</p>
          
          <h4 className="font-sans font-bold text-sm uppercase tracking-wider mb-2 text-zinc-500">Subject Line Format</h4>
          <p className="font-mono text-sm bg-white dark:bg-black p-3 border border-zinc-200 dark:border-zinc-800 rounded mb-2 text-black dark:text-white">Editorial Submission: [Article Title]</p>
          <p className="font-mono text-sm bg-white dark:bg-black p-3 border border-zinc-200 dark:border-zinc-800 rounded text-black dark:text-white">Press Release Submission: [Company Name] – [Announcement Title]</p>
        </div>
      </div>
    </div>
  );
}
