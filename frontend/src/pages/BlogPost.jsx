import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { useApiDetail, useApiList } from '../hooks/useApi';
import { formatDate } from '../utils/formatDate';
import BlogCard from '../components/BlogCard/BlogCard';
import Skeleton from '../components/shared/Skeleton';
import ApiErrorState from '../components/shared/ApiErrorState';

const BlogPost = () => {
  const { slug } = useParams();
  const { data: article, loading, error } = useApiDetail(`/blog/${slug}/`);
  const { data: related } = useApiList(`/blog/${slug}/related/`, undefined, { enabled: !!article });

  if (loading) {
    return (
      <div className="container-app max-w-3xl pb-20 pt-32 sm:pt-40">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-6 h-10 w-3/4" />
        <Skeleton className="mt-8 h-80 w-full rounded-xl3" />
      </div>
    );
  }

  if (error?.status === 404) return <Navigate to="/blog" replace />;

  if (error) {
    return (
      <div className="container-app max-w-3xl pb-20 pt-32 sm:pt-40">
        <ApiErrorState message="Couldn't load this article right now." />
      </div>
    );
  }

  if (!article) return null;

  return (
    <article className="pb-20 pt-32 sm:pt-40">
      <div className="container-app max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 dark:text-teal-300">
          <HiOutlineArrowLeft /> Back to Journal
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-6">
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-600 dark:bg-teal-500/10 dark:text-teal-300">
            {article.category?.name}
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-ink dark:text-white sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-sm text-ink-soft dark:text-white/50">
            {formatDate(article.published_at)} &middot; {article.read_time_minutes} min read
            {article.author_name ? ` \u00b7 by ${article.author_name}` : ''}
          </p>

          {article.cover_image && (
            <div className="mt-8 overflow-hidden rounded-xl3">
              <img src={article.cover_image} alt="" className="h-72 w-full object-cover sm:h-96" />
            </div>
          )}

          <div className="prose prose-slate mt-8 max-w-none whitespace-pre-line text-ink-soft dark:text-white/70">
            <p className="text-lg leading-relaxed">{article.body}</p>
          </div>
        </motion.div>
      </div>

      {related && related.length > 0 && (
        <div className="container-app mt-16 max-w-5xl border-t border-primary-100/60 pt-12 dark:border-white/10">
          <h2 className="mb-8 font-display text-xl font-bold text-ink dark:text-white">More in {article.category?.name}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((a, i) => (
              <BlogCard key={a.id} article={a} index={i} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogPost;
