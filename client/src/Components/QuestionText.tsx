import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import remarkGfm from 'remark-gfm';

interface Props {
  questionText: string;
}
const QuestionText: React.FC<Props> = ({ questionText }) => {
  return (
    <div className="question-text-container">
      <div className="question-text-header">
        <p>Su,aasha</p>
      </div>
      <ReactMarkdown
        className="markdown-text"
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        children={questionText}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={materialLight}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
};

export default QuestionText;
