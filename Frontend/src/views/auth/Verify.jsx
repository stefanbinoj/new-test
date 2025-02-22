import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Verify() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState(false);
  const [para, setPara] = useState(false);

  const location = useLocation();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Prevent non-numeric input

    const newOtp = [...otp];
    newOtp[index] = value;

    // Move focus to next input box if current box is filled
    if (value !== "" && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    setOtp(newOtp);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  // Set email only once when the component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromParams = queryParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [location.search]); // Dependencies: this will only run once when the component mounts

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    if (otp.join("").length !== 6) {
      setError(true);
      setPara("Please enter correct OTP.");
      return;
    }
    setLoading(true);
    setError(false);

    try {
      const response = await axios.post(
        "http://localhost:4002/api/users/verify-otp",
        {
          email: email,
          verificationCode: otp.join(""),
        }
      );

      // Handle successful response
      if (response.data.status === "success") {
        toast.success("Email Verified");
        navigate(`/admin/default`);
      } else {
        setError(true);
        setPara(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      setError(true);

      // Check if the error has a response (for 400, 500, etc.)
      if (error.response) {
        setPara(error.response.data.message); // Access error message from the response
      } else {
        // Handle network errors, timeout errors, etc.
        setPara("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-center">
      {/* Sign in section */}
      <div className="relative mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <div className="">
          <Toaster />
          <Link to="/admin" className="absolute  top-0 mt-0 w-max">
            <div className="mx-auto flex h-fit w-fit items-center hover:cursor-pointer">
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.70994 2.11997L2.82994 5.99997L6.70994 9.87997C7.09994 10.27 7.09994 10.9 6.70994 11.29C6.31994 11.68 5.68994 11.68 5.29994 11.29L0.709941 6.69997C0.319941 6.30997 0.319941 5.67997 0.709941 5.28997L5.29994 0.699971C5.68994 0.309971 6.31994 0.309971 6.70994 0.699971C7.08994 1.08997 7.09994 1.72997 6.70994 2.11997V2.11997Z"
                  fill="#A3AED0"
                />
              </svg>
              <p className="ml-3 text-sm text-gray-600">Back to Dashboard</p>
            </div>
          </Link>
          <h4 className="mb-2.5 mt-8 text-4xl font-bold text-navy-700 dark:text-white">
            Verify otp
          </h4>
          <p className="mb-9 ml-1 text-base text-gray-600">
            otp has been sent to: {email}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit} className="text-center">
              <div className="mb-6 flex gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={digit}
                    maxLength="1"
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="h-16 w-16 rounded-lg border-2 border-gray-300 text-center text-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                ))}
              </div>
              {error && <p className="text-red-500">{para}</p>}
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
      </div>
    </div>
  );
}
