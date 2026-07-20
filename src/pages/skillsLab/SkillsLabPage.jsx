import { useParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import { SKILL_LAB_QUIZZES } from '../../constants/skillLabQuizzes.js';
import useQuizEngine from '../../hooks/useQuizEngine.js';
import useChessPuzzleEngine from '../../hooks/useChessPuzzleEngine.js';
import useSentenceBuilderEngine from '../../hooks/useSentenceBuilderEngine.js';
import SkillsLabNav from '../../components/sections/skillsLab/SkillsLabNav.jsx';
import SkillsLabHeader from '../../components/sections/skillsLab/SkillsLabHeader.jsx';
import SkillsLabProgressBar from '../../components/sections/skillsLab/SkillsLabProgressBar.jsx';
import QuizQuestion from '../../components/sections/skillsLab/QuizQuestion.jsx';
import ChessPuzzle from '../../components/sections/skillsLab/ChessPuzzle.jsx';
import SentenceBuilder from '../../components/sections/skillsLab/SentenceBuilder.jsx';
import HintModal from '../../components/sections/skillsLab/HintModal.jsx';
import ChessHintBody from '../../components/sections/skillsLab/ChessHintBody.jsx';
import QuizResults from '../../components/sections/skillsLab/QuizResults.jsx';

const log = debug('SkillsLabPage');

const EMPTY_QUIZ = { challenges: [], passThreshold: 0, initialLives: 0 };

export default function SkillsLabPage() {
  const { skillSlug } = useParams();
  log('mounting, slug:', skillSlug);

  const quiz = SKILL_LAB_QUIZZES[skillSlug];
  const engagementType = quiz?.engagementType ?? 'mcq';
  const isChess = engagementType === 'chess-puzzle';
  const isSentenceBuilder = engagementType === 'sentence-builder';
  const isMcq = !isChess && !isSentenceBuilder;

  const quizEngine = useQuizEngine(isMcq ? quiz || EMPTY_QUIZ : EMPTY_QUIZ);
  const chessEngine = useChessPuzzleEngine(isChess ? quiz : EMPTY_QUIZ);
  const sentenceEngine = useSentenceBuilderEngine(isSentenceBuilder ? quiz : EMPTY_QUIZ);

  const engine = isChess ? chessEngine : isSentenceBuilder ? sentenceEngine : quizEngine;

  if (!quiz) {
    log.error('quiz not found for slug:', skillSlug);
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f8f4]">
        <p className="text-[#70706e] text-[16px] font-sans">
          Quiz not found for &ldquo;{skillSlug}&rdquo;
        </p>
      </div>
    );
  }

  const {
    phase,
    currentIndex,
    currentChallenge,
    answers,
    score,
    lives,
    streak,
    xp,
    progress,
    total,
    passed,
    passThreshold,
    hintOpen,
    hintsUsed,
    openHint,
    closeHint,
    retry,
    PHASES,
  } = engine;

  log('phase:', phase, 'index:', currentIndex, 'score:', score, 'engagement:', engagementType);

  const remaining = total - answers.length;
  const isResults = phase === PHASES.RESULTS;

  const resultProps = {};
  if (isChess) {
    resultProps.successEmoji = '👑';
    resultProps.successInfoTitle = `✓ ${quiz.skill} badge on your card`;
    resultProps.successInfoBody =
      'Strategic thinking · long-range planning · decisive commitment. All three verified. Recruiters hiring for leadership roles filter for this badge.';
    resultProps.failureBadges = ['No retake penalty', 'New positions each time'];
    resultProps.retryLabel = '↻ Retry · new positions';
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfc]">
      <SkillsLabNav />
      <SkillsLabHeader
        title={quiz.title}
        subtitle={quiz.subtitle}
        score={score}
        total={total}
        remaining={remaining}
      />

      {!isResults && (
        <SkillsLabProgressBar
          currentIndex={currentIndex}
          total={total}
          progress={progress}
          icon={quiz.icon}
          IconComponent={quiz.IconComponent}
          iconBg={quiz.iconBg}
          lives={lives}
          streak={streak}
          xp={xp}
        />
      )}

      {isResults ? (
        <QuizResults
          passed={passed}
          score={score}
          total={total}
          xp={xp}
          answers={answers}
          challenges={quiz.challenges}
          passThreshold={passThreshold}
          skillName={quiz.skill}
          onRetry={retry}
          {...resultProps}
        />
      ) : isChess ? (
        currentChallenge && (
          <ChessPuzzle
            challenge={currentChallenge}
            phase={phase}
            fen={engine.fen}
            moveHistory={engine.moveHistory}
            solutionMove={engine.solutionMove}
            answers={answers}
            currentIndex={currentIndex}
            total={total}
            hintsUsed={hintsUsed}
            skillName={quiz.skill}
            onMakeMove={engine.makeMove}
            onGiveUp={engine.giveUp}
            onNextPuzzle={engine.nextPuzzle}
            onOpenHint={openHint}
          />
        )
      ) : isSentenceBuilder ? (
        currentChallenge && (
          <SentenceBuilder
            challenge={currentChallenge}
            phase={phase}
            placed={engine.placed}
            bank={engine.bank}
            isComplete={engine.isComplete}
            answers={answers}
            currentIndex={currentIndex}
            total={total}
            hintsUsed={hintsUsed}
            skillName={quiz.skill}
            onPlaceWord={engine.placeWord}
            onRemoveWord={engine.removeWord}
            onCheck={engine.checkAnswer}
            onNext={engine.nextQuestion}
            onOpenHint={openHint}
          />
        )
      ) : (
        currentChallenge && (
          <QuizQuestion
            challenge={currentChallenge}
            phase={phase}
            selectedAnswer={engine.selectedAnswer}
            correctIndex={currentChallenge.correctIndex}
            answers={answers}
            currentIndex={currentIndex}
            total={total}
            hintsUsed={hintsUsed}
            skillName={quiz.skill}
            onSelect={engine.selectAnswer}
            onCheck={engine.checkAnswer}
            onNext={engine.nextQuestion}
            onOpenHint={openHint}
          />
        )
      )}

      {currentChallenge && (
        <HintModal
          isOpen={hintOpen}
          onClose={closeHint}
          onUseHint={engine.useHint}
          hint={currentChallenge.hint}
          challenge={currentChallenge}
          skillName={quiz.skill}
          currentIndex={currentIndex}
          total={total}
          score={score}
          passThreshold={passThreshold}
          renderBody={
            isChess
              ? (hint, challenge) => <ChessHintBody hint={hint} challenge={challenge} />
              : undefined
          }
        />
      )}
    </div>
  );
}
