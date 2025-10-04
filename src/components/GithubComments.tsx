import { useEffect, useRef } from 'react';

interface GithubCommentsProps {
  issueTerm: string;
}

const GithubComments = ({ issueTerm }: GithubCommentsProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('repo', 'liguobao/bite-up-bl');
    script.setAttribute('issue-term', issueTerm || 'home');
    script.setAttribute('label', 'feedback');
    script.setAttribute('theme', 'github-dark');

    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [issueTerm]);

  return <div ref={containerRef} className="github-comments" />;
};

export default GithubComments;
