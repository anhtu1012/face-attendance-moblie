import api from "@/config/axios";

export const submitForm = (values: FormData) => {
  return api.post("form/quan-li-don/nguoi-gui", values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getSubmittedForm = (
  submitterId: string,
  offset = 0,
  limit = 10,
) => {
  return api.get(
    `form/quan-li-don/danh-sach-don-nguoi-gui?submitterId=${submitterId}&offset=${offset.toString()}&limit=${limit.toString()}`,
  );
};

export const cancelSubmittedForm = (
  submittedFormId: string,
  data: { reason: string; modifiedDate: string },
) => {
  return api.put(`form/quan-li-don/huy-don/${submittedFormId}`, data);
};
