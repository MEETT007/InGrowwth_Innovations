import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MOCK_POSTS } from '../page';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

// Simulate a rich text component for future Markdown/HTML rendering
const RichTextRenderer = ({ content }: { content: string }) => {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <p>{content}</p>
      <h2>The Core Issue</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <h3>Key Takeaways</h3>
      <ul>
        <li>First important point about the topic.</li>
        <li>Second crucial insight for the industry.</li>
        <li>Third actionable advice for developers and designers.</li>
      </ul>
      <blockquote>
        &quot;The future belongs to those who build it, not those who wait for it to be built.&quot;
      </blockquote>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </div>
  );
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = MOCK_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = MOCK_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto flex flex-col gap-8">
      {/* Back Button */}
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all articles
        </Link>
      </div>

      {/* Header */}
      <header className="flex flex-col gap-6 text-center items-center mt-4">
        <Badge variant="secondary" className="px-3 py-1">
          {post.category}
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
          {post.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl text-balance">{post.excerpt}</p>

        <div className="flex items-center gap-4 mt-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-medium">{post.author.name}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              {post.date}
            </div>
          </div>
        </div>
      </header>

      {/* Thumbnail */}
      <div className="w-full aspect-video rounded-3xl overflow-hidden my-8 glass-card">
        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <article className="mx-auto w-full max-w-3xl">
        <RichTextRenderer content={post.excerpt} />
      </article>

      {/* Social Share & Footer */}
      <div className="mx-auto w-full max-w-3xl border-t border-border/40 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm font-medium text-muted-foreground">Share this article</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Related Articles */}
      <section className="mt-24">
        <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {relatedPosts.map((related) => (
            <Link key={related.slug} href={`/blog/${related.slug}`}>
              <Card className="h-full group cursor-pointer glass-card border-border/50 hover:border-indigo-500/50 overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                <div className="h-32 w-full overflow-hidden">
                  <img
                    src={related.thumbnail}
                    alt={related.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-indigo-500 transition-colors">
                    {related.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
