import logo from "../assets/crowdfunding.png";

const Sections = () => {
  const features = [
    {
      title: "Community-Driven Innovation",
      description: "Fund and vote on projects shaping DeWorld’s future.",
    },
    {
      title: "Milestone-Based Funding",
      description: "Support projects at key stages and track progress.",
    },
    {
      title: "Democratic Approval",
      description: "Community votes to approve or reject innovative ideas.",
    },
    {
      title: "Empowering Creators",
      description: "Back innovators and help bring their projects to life.",
    },
    {
      title: "Transparency & Control",
      description: "Manage investments and influence outcomes with full transparency.",
    },
  ];

  return (
    <section className="relative  bg-gradient-to-r from-rosewine via-fuchsia to-indigoDark text-white h-[80vh] flex items-center justify-center">
      <img
        src={logo}
        alt="Hero"
        className="absolute inset-0 w-full h-[95%] object-cover opacity-30 mix-blend-overlay"
      />
      <div className=" absolute w-full bg-black/30 h-full"></div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 className=" bg-black/20 py-3 text-4xl font-extrabold text-center text-[#f3c0c0] mb-12 drop-shadow-lg">
          Why Choose <span className="text-[#7a81d8] text-shadow-sm">Raise-Fi?</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl p-2 bg-gradient-to-r from-rosewine via-fuchsia to-violet shadow-xl hover:scale-[1.015] transition-transform duration-300"
            >
              <div className="bg-white/20 rounded-[inherit] h-full bg-gradient-to-tr from-rosewine via-fuchsia to-violet p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white mb-4 text-shadow-sm drop-shadow-md">
                  {feature.title}
                </h3>
                <p className="text-gray-100 text-shadow-sm font-semibold leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sections;
