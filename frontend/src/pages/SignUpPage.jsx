import React, { useState } from 'react';
import { useAuth } from '../auth/useAuth';

const SignupPage = () => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  const checkUsernameAvailability = async (username) => {
    setIsUsernameAvailable(null);
    await new Promise((res) => setTimeout(res, 500));
    const taken = ['john', 'admin', 'test'].includes(username.toLowerCase());
    setIsUsernameAvailable(!taken);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'username' && value.length >= 3) {
      checkUsernameAvailability(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSigningUp(true);
    try {
      await signup(formData);
      console.log('Submitted:', formData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome!</h1>
        <p className="text-sm text-center text-base-content/70 mb-6">
          Sign up to get started. It’s quick and easy.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <label className="input validator flex items-center gap-2 bg-neutral text-white rounded-md px-4 py-3 w-full">
              {/* SVG */}
              <input
                type="text"
                name="username"
                required
                placeholder="Username"
                minLength="3"
                maxLength="30"
                value={formData.username}
                onChange={handleChange}
                className="bg-transparent outline-none w-full"
              />
            </label>
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            {isUsernameAvailable === false && (
              <p className="text-sm text-red-500">Username is already taken</p>
            )}
            {isUsernameAvailable === true && (
              <p className="text-sm text-green-500">Username is available</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="input validator flex items-center gap-2 bg-neutral text-white rounded-md px-4 py-3 w-full">
              {/* SVG */}
              <input
                type="email"
                name="email"
                placeholder="mail@site.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent outline-none w-full"
              />
            </label>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="input validator flex items-center gap-2 bg-neutral text-white rounded-md px-4 py-3 w-full">
              {/* SVG */}
              <input
                type="password"
                name="password"
                required
                placeholder="Password"
                minLength="6"
                value={formData.password}
                onChange={handleChange}
                className="bg-transparent outline-none w-full"
              />
            </label>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md"
            disabled={isSigningUp}
          >
            {isSigningUp ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
