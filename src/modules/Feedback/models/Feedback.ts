export type Feedback = {
  id: number;
  createdDate: Date;
  content: string;
  repliedDate: Date;
  repliedById: number;
  replyContent: string;
  itemId: number;
  customer: {
    id: number;
    email: string;
  };
  repliedBy: string;
};
