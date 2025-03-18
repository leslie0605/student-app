import React from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "@/components/MainNavbar";
import { MapPin, Briefcase, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-magic-purple" />,
      title: "Grad School Journey",
      description:
        "Track your application progress with interactive calendar and roadmap views.",
      path: "/journey",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-magic-pink" />,
      title: "University Bucket",
      description:
        "Save and organize your target schools with automatic deadline tracking.",
      path: "/uni-bucket",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-magic-purple" />,
      title: "Magical Tools Inventory",
      description:
        "Discover and organize magical tools to aid your graduate school application journey.",
      path: "/magical-inventory",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-magic-light to-white overflow-hidden">
      <MainNavbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 px-4">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-magic-purple/10 px-3 py-1 rounded-full text-magic-purple text-sm font-medium mb-4 animate-fade-in">
            <span>Interactive Learning Platform</span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-magic-blue to-magic-purple">
              Magic Prep Academy
            </span>
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Your enchanted journey to graduate school preparation, combining
            educational games with powerful application tools.
          </p>

          <div
            className="flex flex-wrap justify-center gap-4 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <button
              onClick={() => navigate("/quiz-selection")}
              className={cn(
                "py-3 px-8 rounded-lg font-medium transition-all-200 shadow-md",
                "bg-gradient-to-r from-magic-blue to-magic-purple text-white",
                "hover:shadow-lg hover:translate-y-[-2px]",
                "active:translate-y-[0px]",
                "flex items-center gap-2"
              )}
            >
              Game Start! <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-40 left-10 w-20 h-20 rounded-full bg-magic-blue/10 animate-float"></div>
        <div
          className="absolute top-60 right-10 w-32 h-32 rounded-full bg-magic-purple/10 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full bg-magic-pink/10 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Magical Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all-300 border border-magic-blue/10 hover:border-magic-purple/30 group cursor-pointer"
                onClick={() => navigate(feature.path)}
              >
                <div className="mb-4 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-magic-blue/10 to-magic-purple/10 group-hover:from-magic-blue/20 group-hover:to-magic-purple/20 transition-all-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center group-hover:text-magic-purple transition-all-200">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
