import rightPanelImage from '../../assets/onboarding/right panel img.svg';

export default function OnboardingRightPanel({ toast }) {
  return (
    <aside
      aria-hidden={toast ? undefined : true}
      className="relative hidden min-h-[calc(100vh-160px)] w-[42%] shrink-0 self-stretch overflow-hidden lg:block"
    >
      <img
        src={rightPanelImage}
        alt=""
        className="absolute inset-0 size-full object-contain"
        loading="lazy"
        decoding="async"
      />
      {toast}
    </aside>
  );
}
