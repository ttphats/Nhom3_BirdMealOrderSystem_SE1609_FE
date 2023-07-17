import AxiosClient from "../../../config/AxiosClient";
import { Feedback, SendFeedbackModel } from "../models";
import { ReplyModel } from "../models/ReplyModel";

const feedbackApi = {
  fetch: (itemId: number, itemType: number): Promise<Feedback[]> =>
    AxiosClient.get(`/Feedbacks?itemId=${itemId}&itemType=${itemType}`),
  send: (feedback: SendFeedbackModel) =>
    AxiosClient.post("/customer/Feedbacks", feedback),
    reply: (feedbackId: number , reply: ReplyModel) =>
    AxiosClient.put(`/staff/Feedbacks/${feedbackId}`, reply),
};

export default feedbackApi;
