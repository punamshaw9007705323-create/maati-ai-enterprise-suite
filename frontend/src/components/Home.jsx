import React from "react";
import {
  ArrowRight,
  Camera,
  CloudSun,
  MapPinned,
  ShieldCheck,
  Sprout,
  Volume2,
} from "lucide-react";

function Home({ setCurrentPage }) {
  const goToTools = () => {
    setCurrentPage("tools");
  };

  const goToDashboard = () => {
    setCurrentPage("dashboard");
  };

  const goToWeather = () => {
    setCurrentPage("weather");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-green-950">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1800&auto=format&fit=crop"
            alt="Agricultural field"
            className="h-full w-full object-cover opacity-30"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              <ShieldCheck size={17} />
              AI-Powered Agriculture Platform
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Early Crop Disease Detection & Precision Agro-Surveillance
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-green-50">
              Protecting smallholder farmers with instant leaf disease
              detection, crop intelligence, weather insights, and
              agro-surveillance.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={goToTools}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-green-900 shadow-lg transition hover:bg-green-50"
              >
                <Camera size={20} />
                Scan a Leaf Now
                <ArrowRight size={18} />
              </button>

              <button
                onClick={goToDashboard}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <MapPinned size={20} />
                Explore Surveillance Map
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 lg:grid-cols-4">
          <div className="px-6 py-8 text-center">
            <p className="text-3xl font-bold text-green-700">94.8%</p>
            <p className="mt-1 text-sm text-slate-500">
              Diagnostic Accuracy
            </p>
          </div>

          <div className="px-6 py-8 text-center">
            <p className="text-3xl font-bold text-green-700">&lt; 2 Sec</p>
            <p className="mt-1 text-sm text-slate-500">
              Inference Latency
            </p>
          </div>

          <div className="px-6 py-8 text-center">
            <p className="text-3xl font-bold text-green-700">38+</p>
            <p className="mt-1 text-sm text-slate-500">
              Pathogen Categories
            </p>
          </div>

          <div className="px-6 py-8 text-center">
            <p className="text-3xl font-bold text-green-700">22</p>
            <p className="mt-1 text-sm text-slate-500">
              Indian Languages
            </p>
          </div>
        </div>
      </section>

      {/* Why Maati AI */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-semibold text-green-700">WHY MAATI AI?</p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Smart Technology. Real Impact.
          </h2>

          <p className="mt-4 text-slate-600">
            Practical AI tools designed to help farmers make faster and more
            informed agricultural decisions.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Camera size={24} />}
            title="Detect Early"
            description="Identify visible crop disease symptoms from a leaf image and get an immediate advisory."
          />

          <FeatureCard
            icon={<ShieldCheck size={24} />}
            title="Works for Farmers"
            description="A simple workflow helps farmers move from disease detection to recommended action."
          />

          <FeatureCard
            icon={<CloudSun size={24} />}
            title="Weather + Disease Risk"
            description="Use weather intelligence alongside crop health information for better decisions."
          />

          <FeatureCard
            icon={<Volume2 size={24} />}
            title="Voice Assistance"
            description="Use browser-based voice assistance to make important agricultural information easier to access."
          />
        </div>
      </section>

      {/* Predict Before You See It */}
      <section className="bg-green-950 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="font-semibold text-green-300">
              PREDICT BEFORE YOU SEE IT
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Make crop decisions using soil intelligence
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-green-100">
              Enter soil and environmental parameters and let the Maati AI
              crop recommendation engine compare them with available crop
              profiles.
            </p>

            <button
              onClick={goToTools}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-green-900 transition hover:bg-green-50"
            >
              Try Crop Recommendation
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <div className="grid grid-cols-2 gap-4">
              <InfoBox label="Nitrogen" value="N" />
              <InfoBox label="Phosphorus" value="P" />
              <InfoBox label="Potassium" value="K" />
              <InfoBox label="Soil pH" value="pH" />
              <InfoBox label="Temperature" value="°C" />
              <InfoBox label="Rainfall" value="mm" />
            </div>
          </div>
        </div>
      </section>

      {/* Surveillance */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-3xl bg-slate-900 shadow-xl">
            <div className="flex min-h-[320px] items-center justify-center bg-gradient-to-br from-green-900 via-emerald-800 to-slate-900">
              <div className="text-center text-white">
                <MapPinned className="mx-auto" size={60} />
                <p className="mt-4 text-xl font-semibold">
                  Live Agro-Surveillance
                </p>
                <p className="mt-2 text-sm text-green-100">
                  Monitor reported agricultural incidents
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-semibold text-green-700">
              LIVE OUTBREAK SURVEILLANCE
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              See agricultural incidents on one map
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              The surveillance dashboard connects incident information with a
              map-based interface so users can inspect reported agricultural
              hotspots.
            </p>

            <button
              onClick={goToDashboard}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              Open Surveillance Dashboard
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Leaf Detect Act */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="font-semibold text-green-700">SIMPLE WORKFLOW</p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Leaf → Detect → Act
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              A straightforward three-step workflow for crop disease
              assessment.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <WorkflowCard
              number="01"
              icon={<Camera size={25} />}
              title="Upload a Leaf"
              description="Upload a clear image of the affected crop leaf."
            />

            <WorkflowCard
              number="02"
              icon={<Sprout size={25} />}
              title="Detect"
              description="The disease analysis workflow evaluates the uploaded image."
            />

            <WorkflowCard
              number="03"
              icon={<ShieldCheck size={25} />}
              title="Act"
              description="Review the available treatment and agricultural advisory."
            />
          </div>
        </div>
      </section>

      {/* Weather CTA */}
      <section className="bg-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-14 md:flex-row lg:px-8">
          <div>
            <p className="font-semibold text-green-700">
              AGRO WEATHER INTELLIGENCE
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Check weather insights for agricultural planning
            </h2>
          </div>

          <button
            onClick={goToWeather}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 font-semibold text-white transition hover:bg-green-800"
          >
            Open Weather Intelligence
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Ask Maati AI */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-3xl bg-green-700 px-6 py-14 text-center text-white shadow-xl sm:px-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
            <Volume2 size={27} />
          </div>

          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            Ask Maati AI
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-green-50">
            Explore the platform's AI-powered agricultural tools and access
            information through a simple, farmer-friendly interface.
          </p>

          <button
            onClick={goToTools}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-green-800 transition hover:bg-green-50"
          >
            Explore AI Tools
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function WorkflowCard({ number, icon, title, description }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-7">
      <span className="text-sm font-bold text-green-700">{number}</span>

      <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>

      <p className="mt-3 leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-5">
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-green-100">{label}</p>
    </div>
  );
}

export default Home;