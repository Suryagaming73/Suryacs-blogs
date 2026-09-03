import { sqliteTable, text, integer, primaryKey, uniqueIndex } from 'drizzle-orm/sqlite-core'

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash'),
  role: text('role', { enum: ['admin', 'viewer'] }).notNull().default('viewer'),
  avatarUrl: text('avatar_url'),
  bio: text('bio').default(''),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
})

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description').default(''),
  icon: text('icon').default(''),
  color: text('color').default('#6c5ce7'),
  parentId: text('parent_id'),
  order: integer('order').default(0),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
})

// ─── Tags ─────────────────────────────────────────────────────────────────────
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
})

// ─── Post Series ──────────────────────────────────────────────────────────────
export const postSeries = sqliteTable('post_series', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description').default(''),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
})

// ─── Posts ────────────────────────────────────────────────────────────────────
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull().default(''),
  excerpt: text('excerpt').default(''),
  featuredImageUrl: text('featured_image_url'),
  authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: text('category_id').references(() => categories.id, { onDelete: 'set null' }),
  seriesId: text('series_id').references(() => postSeries.id, { onDelete: 'set null' }),
  seriesOrder: integer('series_order').default(0),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).notNull().default('draft'),
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
  viewsCount: integer('views_count').default(0),
  readingTime: integer('reading_time').default(1),
  metaTitle: text('meta_title').default(''),
  metaDescription: text('meta_description').default(''),
  externalLink: text('external_link'),
  externalLinkText: text('external_link_text'),
  publishedAt: text('published_at'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString()),
})

// ─── Post ↔ Tags (pivot) ──────────────────────────────────────────────────────
export const postTags = sqliteTable('post_tags', {
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  tagId: text('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.postId, t.tagId] }),
}))

// ─── Comments ─────────────────────────────────────────────────────────────────
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  parentId: text('parent_id'),
  content: text('content').notNull(),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
})

// ─── Post Likes ───────────────────────────────────────────────────────────────
export const postLikes = sqliteTable('post_likes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
}, (t) => ({
  uniq: uniqueIndex('post_likes_unique').on(t.postId, t.userId),
}))

// ─── Newsletter Subscribers ───────────────────────────────────────────────────
export const subscribers = sqliteTable('subscribers', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
})

// ─── Contact Messages ─────────────────────────────────────────────────────────
export const contactMessages = sqliteTable('contact_messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
})

// ─── Projects ───────────────────────────────────────────────────────────────────
export const projects = sqliteTable('projects', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  tech: text('tech').notNull(),
  desc: text('desc').notNull(),
  link: text('link'),
  icon: text('icon').default('📁'),
  order: integer('order').default(0),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
})

// ─── Services ─────────────────────────────────────────────────────────────────
export const services = sqliteTable('services', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  desc: text('desc').notNull(),
  icon: text('icon').default('✨'),
  order: integer('order').default(0),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
})

// ─── Settings ───────────────────────────────────────────────────────────────────
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
})

// ─── Type Exports ─────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect
export type Post = typeof posts.$inferSelect
export type Category = typeof categories.$inferSelect
export type Tag = typeof tags.$inferSelect
export type Comment = typeof comments.$inferSelect
export type PostLike = typeof postLikes.$inferSelect
export type Subscriber = typeof subscribers.$inferSelect
export type ContactMessage = typeof contactMessages.$inferSelect
export type PostSeries = typeof postSeries.$inferSelect
export type Project = typeof projects.$inferSelect
export type Service = typeof services.$inferSelect
