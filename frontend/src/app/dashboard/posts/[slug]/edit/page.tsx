import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/db'
import { posts, postTags } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { PostForm } from '@/components/dashboard/PostForm'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await db.select({ title: posts.title }).from(posts).where(eq(posts.slug, slug)).get()
  return { title: post ? `Edit: ${post.title}` : 'Edit Post' }
}

export default async function EditPostPage({ params }: Props) {
  const { slug } = await params
  const post = await db.select().from(posts).where(eq(posts.slug, slug)).get()
  if (!post) notFound()

  const tagRows = await db.select({ tagId: postTags.tagId }).from(postTags).where(eq(postTags.postId, post.id))
  const tagIds = tagRows.map(r => r.tagId)

  return (
    <PostForm
      mode="edit"
      slug={slug}
      initialData={{
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        featuredImageUrl: post.featuredImageUrl,
        categoryId: post.categoryId,
        status: post.status,
        isFeatured: post.isFeatured || false,
        externalLink: post.externalLink,
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
        tagIds,
      }}
    />
  )
}
