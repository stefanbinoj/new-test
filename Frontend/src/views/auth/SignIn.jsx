import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox";
import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [para, setPara] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    console.log("hiu");
  };
  const handleEmaiSignIn = async () => {
    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;
    console.log(emailInputRef.current.value);
    console.log(passwordInputRef.current.value);
    setLoading(true);
    setPara(false);

    try {
      const response = await axios.post(
        "http://localhost:4002/api/users/login",
        { email, password }
      );
      console.log(response);
      // Handle successful response
      if (response.status === 200) {
        console.log("navigating");
        navigate("/");
        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);

          console.log("Login successful!");
        } else {
          console.log("Login failed!");
        }
      }
    } catch (error) {
      console.log("else block");
      setPara(true);
    } finally {
      setLoading(false);
    }
  };
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
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
        <p
          className="text-red-500"
          style={{ display: !para ? "none" : "block" }}
        >
          Invalid Credentials
        </p>
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center">
            <Checkbox />
            <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
              Keep me logged In
            </p>
          </div>
          <a
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            href=" "
          >
            Forgot Password?
          </a>
        </div>
        <button
          onClick={handleEmaiSignIn}
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        >
          Sign In
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
