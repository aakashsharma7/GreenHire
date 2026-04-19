import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dummy',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Since we may not actually have a Sanity project deployed yet,
// we provide a fallback UI.
export default async function BlogIndex() {
  let posts: any[] = [];
  
  try {
    posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc)`);
  } catch (e) {
    console.log('Sanity fetch failed. Likely missing project ID.');
  }

  return (
    <div className="min-h-screen pt-32 pb-20 max-w-7xl mx-auto px-6">
      <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">
        Latest insights & case studies
      </h1>
      
      {posts.length === 0 ? (
        <div className="py-20 text-center border border-border-subtle rounded-3xl bg-bg-surface mt-10">
          <p className="font-body text-text-muted">No posts found. Configure your Sanity Project ID to load content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {posts.map((post: any) => (
            <a key={post._id} href={`/blog/${post.slug.current}`} className="group block border border-border-subtle rounded-2xl bg-bg-surface overflow-hidden hover:border-accent-primary transition-colors" data-cursor="pointer">
              <div className="h-48 bg-bg-elevated" />
              <div className="p-6">
                <h3 className="font-display font-medium text-xl text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-primary group-hover:to-accent-secondary">
                  {post.title}
                </h3>
                <p className="font-body text-sm text-text-secondary">
                  By {post.author}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
