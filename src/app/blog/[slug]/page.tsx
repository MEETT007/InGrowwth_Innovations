import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  User,
  ArrowLeft,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon,
} from 'lucide-react';
import { mockBlogPosts } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const post = mockBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Get 3 related posts (excluding current)
  const relatedPosts = mockBlogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to all articles
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              {post.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-foreground">{post.author.name}</p>
                <p className="text-xs flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {post.publishDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full max-w-5xl mx-auto mb-16 px-4">
        <div className="rounded-2xl overflow-hidden shadow-xl aspect-video relative">
          <img src={post.thumbnail} alt={post.title} className="object-cover w-full h-full" />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl flex flex-col md:flex-row gap-12">
        {/* Social Share Sidebar */}
        <div className="md:w-16 flex md:flex-col gap-4 items-center md:items-start pt-2">
          <span className="text-xs font-semibold uppercase text-muted-foreground md:mb-4">
            Share
          </span>
          <Button variant="outline" size="icon" className="rounded-full">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Linkedin className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Facebook className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Article Content */}
        <article className="md:w-[calc(100%-4rem)] prose prose-lg dark:prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="space-y-6 text-lg leading-relaxed [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:mt-12 [&>h2]:mb-6 [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-4 [&>p]:mb-6 text-foreground/90"
          />
        </article>
      </div>

      {/* Related Articles */}
      <div className="container mx-auto px-4 max-w-6xl mt-24">
        <Separator className="mb-16" />
        <h3 className="text-3xl font-bold mb-10 text-center">More from our Blog</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedPosts.map((relatedPost) => (
            <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
              <Card className="h-full cursor-pointer overflow-hidden border-0 bg-card hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={relatedPost.thumbnail}
                    alt={relatedPost.title}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardHeader className="p-5">
                  <CardTitle className="text-xl line-clamp-2 hover:text-primary transition-colors">
                    {relatedPost.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
