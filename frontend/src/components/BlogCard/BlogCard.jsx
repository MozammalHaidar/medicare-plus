import { motion } from 'framer-motion';
import { HiOutlineArrowRight, HiOutlineNewspaper } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';

const BlogCard = ({ article, index = 0 }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-xl2 bg-white shadow-soft transition-shadow duration-300 hover:shadow-card dark:bg-darksurface-card"
    >
      <Link to={`/blog/${article.slug}`} className="block">
        <div className="relative h-48 overflow-hidden bg-primary-50 dark:bg-white/5">
          {article.cover_image ? (
            <img
              src={article.cover_image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <HiOutlineNewspaper className="text-4xl text-primary-200 dark:text-white/20" />
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-teal-600">
            {article.category_name}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-ink-soft dark:text-white/40">
            <span>{formatDate(article.published_at)}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{article.read_time_minutes} min read</span>
          </div>
          <h3 className="mt-2 font-display text-base font-bold leading-snug text-ink dark:text-white">
            {article.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-white/50">{article.excerpt}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 dark:text-teal-300">
            Read Article <HiOutlineArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
