type ErrorStateProps = {
  onRetry: () => void;
};

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state__icon">!</div>
      <strong>조회 실패 상태</strong>
      <p>데이터를 불러오지 못했습니다. 다시 시도해 주세요.</p>
      <button type="button" className="error-state__button" onClick={onRetry}>
        다시 시도
      </button>
    </div>
  );
}
