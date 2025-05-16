import React from "react";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const { setShowUserLogin, setUser } = useAppContext();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setUser({
      name: "Gourab Ganguly",
      email: "gourab@gmail.com"
    });
    setShowUserLogin(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        onClick={() => setShowUserLogin(false)}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.form
          onClick={(e) => e.stopPropagation()}
          onSubmit={onSubmitHandler}
          className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200 rounded-2xl px-6 py-8 w-full max-w-md flex flex-col gap-6"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          <h2 className="text-3xl font-semibold text-center text-gray-800">
            {state === "login" ? "Welcome Back 👋" : "Create an Account 📝"}
          </h2>

          {state === "register" && (
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Your name"
                className="mt-1 px-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                required
              />
            </div>
          )}

          <div className="w-full">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="you@example.com"
              className="mt-1 px-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              type="email"
              required
            />
          </div>

          <div className="w-full">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="********"
              className="mt-1 px-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              type="password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dull transition-all"
          >
            {state === "register" ? "Sign Up" : "Login"}
          </button>

          <p className="text-sm text-center text-gray-600">
            {state === "login" ? (
              <>
                Don't have an account?{" "}
                <span
                  onClick={() => setState("register")}
                  className="text-primary font-medium cursor-pointer hover:underline"
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setState("login")}
                  className="text-primary font-medium cursor-pointer hover:underline"
                >
                  Login
                </span>
              </>
            )}
          </p>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default Login;
