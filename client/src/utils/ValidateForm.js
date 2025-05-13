import toast from "react-hot-toast";

export const validateForm = (formData) => {
    if (!formData.fullname.trim()) {
        toast.error("Full name is required");
        return false; 
    }
    if (!formData.email.trim()) {
        toast.error("Email is required");
        return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error("Invalid email format");
        return false;
    }
    if (!formData.password) {
        toast.error("Password is required");
        return false;
    }
    if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    return true;
};
