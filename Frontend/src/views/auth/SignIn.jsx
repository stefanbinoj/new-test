import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [para, setPara] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const errorFromFrontend = queryParams.get("error");

    if (errorFromFrontend) {
      setError(true);
      setPara("Please login With Email & Password instead");
      toast.error("Please login With Email & Password instead");
    }
  }, [location.search]); // Dependency array includes location.search to rerun effect when URL changes

  const handleGoogleSignIn = async () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/users/google`;
  };
  const handleEmaiSignIn = async () => {
    const email = emailInputRef.current.value; // No need for JSON.stringify()
    const password = passwordInputRef.current.value;

    if (!email || !password) {
      setError(true);
      setPara("All fields are mandatory");
      return;
    }

    if (!email.includes("@")) {
      setError(true);
      setPara("Please provide a valid email");
      return;
    }

    if (password.length < 8) {
      setError(true);
      setPara("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError(false);
    let response = null;
    try {
      response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        { email, password },
        {
          withCredentials: true, // Add this to allow cookies
        }
      );
      // Handle successful response
      if (response.data.status === "success") {
        setError(false);
        toast.success("Login Successfull");
        await new Promise((resolve) => setTimeout(resolve, 100));

        const { showCompany } = response.data;

        if (showCompany === true) {
          window.location.href = "/admin/default?showCompanyModel=true";
        } else {
          window.location.href = "/admin/default";
        }
      } else {
        setError(true);
        setPara(response.data.message);
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

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <Toaster />
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
        <div
          onClick={handleGoogleSignIn}
          className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800"
        >
          <div className="rounded-full text-xl">
            <FcGoogle />
          </div>
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">
            Sign In with Google
          </h5>
        </div>
        <div className="mb-6 flex items-center  gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white"> or </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>
        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@simmmple.com"
          id="email"
          type="text"
          ref={emailInputRef}
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="Min. 8 characters"
          id="password"
          type="password"
          ref={passwordInputRef}
        />
        {/* Checkbox */}
        {error && <p className="text-red-500">{para}</p>}

        <button
          onClick={handleEmaiSignIn}
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <a
            href="/auth/register"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
