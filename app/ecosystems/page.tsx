import {
  Globe,
  Wallet,
  Network,
  Wrench,
  Award,
  Users,
  Building2,
  Shield,
  TimerIcon,
} from "lucide-react";
import ApplicationCard from "@/components/ecosystem-cards";

const web3Applications = [
  {
    id: 1,
    name: "PomoHood",
    description:
      "Innovation through critical infrastructure development and EVM compatibility.",
    icon: (
      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
        <TimerIcon className="w-6 h-6 text-white" />
      </div>
    ),
    socialLinks: ["website"],
  },
];

const enterpriseApplications = [
  {
    id: 8,
    name: "Payment Gateway",
    description: "Next-generation tokenization and payment solutions.",
    icon: (
      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
        <Wrench className="w-6 h-6 text-white" />
      </div>
    ),
    socialLinks: ["website"],
  },
];

export default function EcosystemPage() {
  return (
    <div className="min-h-screen bg-darker">
      <section className="page-header">
        <div className="container">
          <h1>BlockHood Ecosystem</h1>
          <p>
            Explore our collection of beginner-friendly guides to help you
            navigate the Web3 ecosystem
          </p>
        </div>
      </section>
      <main className="container mx-auto px-6 py-8">
        {/* Web3 Ecosystem Applications Section */}
        <section className="my-16">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-light">
              Web3 Ecosystem Applications
            </h1>
            <button className="cta-button cta-secondary">VIEW ALL</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {web3Applications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        </section>

        {/* Enterprise Applications Section
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-light">
              Enterprise Applications
            </h2>
            <button className="cta-button cta-secondary">VIEW ALL</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {enterpriseApplications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        </section> */}
      </main>
    </div>
  );
}
