import AxiosClient from "../../../config/AxiosClient";
import { Feedback, SendFeedbackModel } from "../models";

const feedbackApi = {
  fetch: (itemId: number, itemType: number): Promise<Feedback[]> =>
    AxiosClient.get(`/Feedbacks?itemId=${itemId}&itemType=${itemType}`),
  send: (feedback: SendFeedbackModel) =>
    AxiosClient.post("/customer/Feedbacks", feedback),
};

export default feedbackApi;
