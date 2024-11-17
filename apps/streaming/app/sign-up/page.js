'use client'
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Sign-Up Data:", data);
    // Add your sign-up logic (e.g., API call) here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" },
              })}
              className={`w-full px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? "focus:ring-red-500" : "focus:ring-blue-400"
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid phone number (10 digits)",
                },
              })}
              className={`w-full px-4 py-2 border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.phone ? "focus:ring-red-500" : "focus:ring-blue-400"
              }`}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-blue-400"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? "focus:ring-red-500" : "focus:ring-blue-400"
              }`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-4">
          {/* Google Login Button */}
          <button
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google.png"
              alt="Google"
              width={250}
              height={42}
              className="w-20 h-auto mr-2"
            />
            Sign Up with Google
          </button>

          {/* Facebook Login Button */}
          <button
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
              alt="Facebook"
              width={250}
              height={42}
              className="w-5 h-5 mr-2"
            />
            Sign Up with Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
