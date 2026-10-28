import { Link, useParams } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import HelpArticle from '../../components/sections/parent/help/HelpArticle.jsx';
import { ARTICLES } from '../../components/sections/parent/help/data/articleData.js';

/*
 * ParentHelpArticlePage — /parent/help/:topicId (Figma canvas "Parent · 10 Help and safety" 10057:67418). Only `opting-out` is drawn (PH-02 10053:3343); any other topic shows a short
 * "not designed yet" note inside the chrome with a way back, so the Help page never dead-ends. Sidebar "Help and guides" active.
 */
const ParentHelpArticlePage = () => {
  const { topicId } = useParams();
  const article = ARTICLES[topicId];
  useDocumentTitle(article ? article.title : 'Help and guides');
  return (
    <ParentFrame active="help" sidebar="linked">
      {article ? (
        <HelpArticle article={article} />
      ) : (
        <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[8px]">
          <h1 className="m-0 font-sans text-[34px] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
            Help and guides
          </h1>
          <p className="m-0 font-sans text-[16px] leading-[24px] text-[#999]">
            This article is not designed yet.{' '}
            <Link to="/parent/help" className="font-semibold text-[#387440]">
              Back to Help and guides
            </Link>
          </p>
        </div>
      )}
    </ParentFrame>
  );
};

export default ParentHelpArticlePage;
