import { useState } from 'react';
import PageHero from '../components/shared/PageHero';
import BlogCard from '../components/BlogCard/BlogCard';
import { BlogCardSkeleton } from '../components/shared/Skeleton';
import ApiErrorState from '../components/shared/ApiErrorState';
import Newsletter from '../components/shared/Newsletter';
import { useApiList } from '../hooks/useApi';

const Blog = () => {
  const [activeCategorySlug, setActiveCategorySlug] = useState('all');

  const { data: categories } = useApiList('/blog/categories/');
  const { data: articles, loading, error } = useApiList('/blog/', {
    category__slug: activeCategorySlug === 'all' ? undefined : activeCategorySlug,
    ordering: '-published_at',
  });

  return (
    <>
      <PageHero
        eyebrow="The Journal"
        title="Health insights, explained simply"
        description="Practical, doctor-reviewed articles to help you understand your care before you walk in the door."
      />
      <section className="container-app py-16">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveCategorySlug('all')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeCategorySlug === 'all'
                ? 'bg-grad-primary text-white'
                : 'bg-white text-ink-soft hover:text-teal-600 dark:bg-darksurface-card dark:text-white/60'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategorySlug(cat.slug)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeCategorySlug === cat.slug
                  ? 'bg-grad-primary text-white'
                  : 'bg-white text-ink-soft hover:text-teal-600 dark:bg-darksurface-card dark:text-white/60'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        )}
        {!loading && error && (
          <div className="mt-10">
            <ApiErrorState message="Couldn't load articles right now." />
          </div>
        )}
        {!loading && !error && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <BlogCard key={article.id} article={article} index={i} />
            ))}
          </div>
        )}
      </section>
      <div className="pb-20">
        <Newsletter />
      </div>
    </>
  );
};

export default Blog;
