import { debug } from '../../../utils/debug.js';

const log = debug('CodeSnippet');

const COLOR_MAP = {
  variable: '#c0392b',
  value: '#387440',
  function: '#3062d4',
  number: '#fef08a',
  comment: '#595959',
};

export default function CodeSnippet({ tokens }) {
  log('rendering code snippet, tokens:', tokens.length);

  return (
    <div className="bg-[rgba(235,241,236,0.5)] border-l-[3px] border-[#387440] rounded-tr-[10px] rounded-br-[10px] h-[clamp(40px,3.6vw,52px)] flex items-center px-[15px]">
      <code className="font-sans font-medium text-[clamp(11px,0.97vw,14px)] leading-[22.75px] whitespace-nowrap overflow-x-auto">
        {tokens.map((token, i) => (
          <span key={i} style={{ color: COLOR_MAP[token.color] || '#387440' }}>
            {token.text}
          </span>
        ))}
      </code>
    </div>
  );
}
