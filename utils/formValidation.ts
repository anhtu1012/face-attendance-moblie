import * as Yup from "yup";

export const formValidationSchema = Yup.object().shape({
  dpReason: Yup.string().required("Phải nhập lý do"),
});
