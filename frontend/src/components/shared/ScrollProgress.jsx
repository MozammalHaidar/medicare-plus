import { useScrollPosition } from '../../hooks/useScrollPosition';

const ScrollProgress = () => {
  const { progress } = useScrollPosition();

  return (
    <div className="fixed left-0 top-0 z-[60] h-[3px] w-full bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-grad-cta transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
};

export default ScrollProgress;
