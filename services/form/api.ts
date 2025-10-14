import api from "@/config/axios";

export const submitForm = (values: FormData) => {
  return api.post("form/quan-li-don/nguoi-gui", values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getSubmittedForm = (submitterId: string) => {
  return api.get(
    `form/quan-li-don/danh-sach-don-nguoi-gui?submitterId=${submitterId}`,
  );
};
