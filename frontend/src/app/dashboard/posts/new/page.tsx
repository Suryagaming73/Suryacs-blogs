import { Metadata } from 'next'
import { PostForm } from '@/components/dashboard/PostForm'

export const metadata: Metadata = { title: 'New Post | Dashboard' }

export default function NewPostPage() {
  return <PostForm mode="create" />
}
