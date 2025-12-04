import type React from "react";
import { User, Sparkles } from "lucide-react";

interface WelcomeBannerProps {
  userName: string;
  userSchool: string;
  userRole: string;
}

const WelcomeBanner = ({
  userName,
  userSchool,
  userRole
}: WelcomeBannerProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-8 shadow-2xl">
      <div className="absolute inset-0 bg-grid-white/[0.2] [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.5))]"></div>
      <div className="relative flex items-center z-10">
        <div className="mr-6 flex-shrink-0">
          <div className="rounded-full bg-white p-3 shadow-inner shadow-blue-500/50">
            <User className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <div className="flex-grow">
          <h2 className="text-3xl font-bold text-white mb-1 flex items-center">
            Welcome back, {userName}!
            <Sparkles className="h-6 w-6 ml-2 text-yellow-300" />
          </h2>
          <p className="text-xl text-blue-100 mb-3">{userSchool}</p>
          <span className="inline-block bg-blue-700 text-blue-100 text-sm font-medium px-3 py-1 rounded-full shadow-lg">
            {userRole}
          </span>
        </div>
      </div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-blue-300 to-blue-400 opacity-50 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 -translate-x-1/2 translate-y-1/4 h-48 w-48 rounded-full bg-gradient-to-tr from-blue-200 to-blue-300 opacity-40 blur-2xl"></div>
    </div>
  );
};

export default WelcomeBanner;
