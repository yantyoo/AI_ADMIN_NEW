import { getFeedbacks } from "@/api/feedback";
import { FeedbackPanel } from "@/features/feedback/feedback-panel";

export async function FeedbackPage() {
  const feedbacks = await getFeedbacks();

  return <FeedbackPanel feedbacks={feedbacks} />;
}
