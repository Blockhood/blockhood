import type React from "react";
import { Globe, MessageCircle, Send, Twitter } from "lucide-react";
import Link from "next/link";

interface Application {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  socialLinks: string[];
}

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "website":
        return <Globe className="w-4 h-4" />;
      case "discord":
        return <MessageCircle className="w-4 h-4" />;
      case "telegram":
        return <Send className="w-4 h-4" />;
      case "twitter":
        return <Twitter className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <Link target="_blank" href={"https://pomohood.vercel.app/"}>
      <div className="cta-secondary bg-dark border border-primary/30 rounded-xl p-6 hover:border-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        {/* Icon */}
        <div className="flex justify-center mb-4">{application.icon}</div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-light mb-2">
            {application.name}
          </h3>
          <div className="h-10"></div>
          {/* <p className="text-sm text-light/70 leading-relaxed">
          {application.description}
        </p> */}
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-3">
          {application.socialLinks.map((platform, index) => (
            <button
              key={index}
              className="p-2 text-light/60 hover:text-primary transition-colors"
              aria-label={platform}
            >
              {getSocialIcon(platform)}
            </button>
          ))}
        </div>
      </div>
    </Link>
  );
}
