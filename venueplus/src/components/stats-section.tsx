export function StatsSection() {
  const stats = [
    {
      icon: "⭐",
      value: "4.9",
      label: "User Rating",
      description: "Based on 50K+ reviews",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: "✨",
      value: "100%",
      label: "Customized Trips",
      description: "Tailored to your preferences",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: "🛡️",
      value: "99.8%",
      label: "Success Rate",
      description: "Trips completed successfully",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: "🎧",
      value: "24/7",
      label: "Support",
      description: "Always here to help",
      color: "from-pink-400 to-purple-500"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Trusted by <span className="font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Travelers Worldwide</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join the community of explorers who have discovered their perfect journeys with VenuePlus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group text-center p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all-smooth hover:scale-105"
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.color} p-4 group-hover:scale-110 transition-transform-smooth`}>
                <div className="text-2xl">{stat.icon}</div>
              </div>
              
              <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform-smooth">
                {stat.value}
              </div>
              
              <div className="text-lg font-semibold text-blue-200 mb-2">
                {stat.label}
              </div>
              
              <div className="text-sm text-gray-300">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
            <span className="text-white">🚀</span>
            <span className="text-white font-medium">Join 50,000+ happy travelers</span>
          </div>
        </div>
      </div>
    </section>
  )
}
