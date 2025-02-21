import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Verify() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [para, setPara] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Set email only once when the component mounts
  useEffect(() => {
    const emailFromParams = queryParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [queryParams]); // Dependencies: this will only run once when the component mounts

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    setLoading(true);
    setPara(false);

    if (!otp) {
      setPara("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4002/api/users/verify-otp",
        {
          email: email,
          verificationCode: otp,
        }
      );
      console.log(response);

      // Handle successful response
      if (response.status === 200) {
        console.log("navigating");
        toast.success("Email Verified");
        navigate("/auth/sign-in");
      } else {
        toast.error("Email Verified failed");
      }
    } catch (error) {
      console.log("else block");
      setPara(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Verify otp
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          otp has been sent to: {email}
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              maxLength="6" // Assuming OTP is 6 digits
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
          </div>
          {para && <p style={{ color: "red" }}>{para}</p>}
          <button
            type="submit"
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Submit OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
