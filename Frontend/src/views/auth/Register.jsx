import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [para, setPara] = useState("");
  const navigate = useNavigate();

  const HandleGoogleSignIn = async () => {
    // Assuming the backend sends the JWT token in the response
    window.location.href = `${process.env.REACT_APP_API_URL}/api/users/google`;
  };

  const handleEmaiSignIn = async () => {
    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;
    setLoading(true);
    setError(false);
    let response = null;

    try {
      response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        { email, password }
      );

      // Handle successful response
      if (response.data.status === "success") {
        setError(false);
        toast.success("Email registered successfully ");

        setTimeout(() => {
          console.log("After 1 second");
        }, 1000);
        navigate(`/auth/verify?email=${email}`);
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
    <div className="relative mb-16 mt-16 flex h-full w-full items-center justify-center  px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-center">
      <div className="bg-white px-11 py-8">
        <Link to="/admin" className="absolute top-10 w-max  ">
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
        {/* Sign in section */}
        <Toaster />
        <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
          <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
            Register here
          </h4>
          <p className="mb-9 ml-1 text-base text-gray-600">
            Enter your email and password to sign in!
          </p>
          <div
            onClick={HandleGoogleSignIn}
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
            type="email"
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
          {/* <p ref={pararef}>{pararef.current}</p> */}
          {error && <p className="text-red-500">{para}</p>}

          <button
            onClick={handleEmaiSignIn}
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            disabled={loading}
          >
            {loading ? "Loading..." : "Create Account"}
          </button>
          <div className="mt-4">
            <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
              ALready have an acc?
            </span>
            <a
              href="/auth/sign-in"
              className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            >
              login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
