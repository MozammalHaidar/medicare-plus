import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

const ApiErrorState = ({ message = "Couldn't load this content right now." }) => (
  <div className="flex flex-col items-center gap-2 rounded-xl2 border border-dashed border-primary-100 bg-white/50 py-10 text-center dark:border-white/10 dark:bg-white/5">
    <HiOutlineExclamationTriangle className="text-2xl text-amber-500" />
    <p className="text-sm font-medium text-ink-soft dark:text-white/60">{message}</p>
  </div>
);

export default ApiErrorState;
