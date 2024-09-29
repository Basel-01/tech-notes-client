import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastType = "info" | "success" | "warn" | "error";

const notify = (message: string, type: ToastType) => {
  toast[type](message);
};

export default notify;
