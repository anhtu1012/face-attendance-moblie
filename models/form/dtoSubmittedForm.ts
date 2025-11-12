import { formCategory } from "@/constants/form";

export type SubmittedFormItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  reason: string;
  response: string | null;
  file: string;
  status: "INACTIVE" | "PENDING" | "ACCEPTED" | "REJECTED";
  startTime: string;
  endTime: string;
  approvedTime: string;
  formCategoryId: formCategory;
  formCategoryTitle: string;
  submittedBy: string;
  submittedName: string;
  approvedBy: string;
  approvedName: string;
};

export interface dtoSubmittedForm {
  count: number;
  limit: number;
  page: number;
  data: SubmittedFormItem[];
}
