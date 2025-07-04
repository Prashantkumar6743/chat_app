import React, { useEffect } from "react";
import { useTheme } from "../auth/useTheme"; 
import { THEMES } from "../constants"; 

const demoMessage = {
  from: "Alice",
  text: "Hey there! How are you?",
  time: "2:30 PM",
};

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("chat-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-base-200 p-6 text-base-content">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Theme</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {THEMES.map((themeName) => (
            <div
              key={themeName}
              data-theme={themeName}
              onClick={() => setTheme(themeName)}
              className={`cursor-pointer rounded-xl border border-base-300 bg-base-100 shadow-md p-4 hover:scale-[1.02] transition transform ${
                theme === themeName ? "ring ring-primary ring-offset-2" : ""
              }`}
            >
              <h2 className="text-lg font-semibold mb-2 capitalize">{themeName}</h2>

              <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img src="https://i.pravatar.cc/150?img=32" alt="User" />
                  </div>
                </div>
                <div className="chat-header">
                  {demoMessage.from}
                  <time className="text-xs opacity-50 ml-2">{demoMessage.time}</time>
                </div>
                <div className="chat-bubble bg-base-300 text-base-content">
                  {demoMessage.text}
                </div>
              </div>

              {theme === themeName && (
                <p className="mt-3 text-sm font-medium text-success text-center">
                  Active Theme
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
