import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Zap, Calendar, BarChart3, Clock, CheckCircle2, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-emerald-50/20">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="relative container mx-auto px-4">
            <div className="text-center mb-16 lg:mb-20">
              <div className="animate-in fade-in duration-1000">
                <div className="inline-block mb-6 px-4 py-2 bg-emerald-100 rounded-full">
                  <span className="text-emerald-700 font-semibold text-sm">✨ AI-Powered Productivity</span>
                </div>
                
                <h1 className="font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-6 text-slate-900 leading-tight tracking-tight">
                  Turn Overwhelming Tasks Into
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 block mt-3 animate-in slide-in-from-left duration-1000 delay-300">
                    10-Minute Wins
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in duration-1000 delay-500">
                  AI-powered task breakdown that transforms your biggest challenges into manageable chunks, scheduled perfectly with focus timers and intelligent nudges.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in duration-1000 delay-700">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  asChild
                >
                  <a href="/capture" className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Start Breaking Down Tasks
                  </a>
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl transition-all duration-300"
                  asChild
                >
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 pt-12 border-t border-slate-200">
              <div className="text-center p-4">
                <div className="text-4xl font-bold text-emerald-600 mb-2">10min</div>
                <p className="text-slate-600 font-medium">Perfect Focus Sessions</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-bold text-teal-600 mb-2">AI</div>
                <p className="text-slate-600 font-medium">Smart Task Breakdown</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-bold text-cyan-600 mb-2">100%</div>
                <p className="text-slate-600 font-medium">Personalized Scheduling</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-32 bg-white relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">How It Works</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Four powerful steps to transform overwhelming projects into achievable progress
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Smart Breakdown",
                  description: "AI analyzes your tasks and creates precise 10-minute chunks with clear acceptance criteria.",
                  color: "from-emerald-500 to-teal-500",
                },
                {
                  icon: <Calendar className="w-8 h-8" />,
                  title: "Auto Scheduling",
                  description: "Intelligently fits chunks into your calendar, respecting work hours and energy levels.",
                  color: "from-teal-500 to-cyan-500",
                },
                {
                  icon: <Clock className="w-8 h-8" />,
                  title: "Focus Timer",
                  description: "Distraction-free sessions with gentle check-ins and smart productivity suggestions.",
                  color: "from-cyan-500 to-blue-500",
                },
                {
                  icon: <BarChart3 className="w-8 h-8" />,
                  title: "Progress Insights",
                  description: "Learn from your patterns with completion analytics and personalized recommendations.",
                  color: "from-blue-500 to-emerald-500",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-2 bg-gradient-to-br from-slate-50 to-slate-100"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  <CardHeader className="relative">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white w-fit mb-4`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-slate-600 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-b from-emerald-50/30 to-transparent">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="animate-in fade-in duration-1000">
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8">Stop Procrastinating, Start Progressing</h2>
                
                <div className="space-y-6">
                  {[
                    {
                      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />,
                      title: "Break the Overwhelm Cycle",
                      description: "Transform paralyzing big tasks into clear, actionable steps you can tackle immediately."
                    },
                    {
                      icon: <TrendingUp className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />,
                      title: "Build Momentum Daily",
                      description: "Complete meaningful work in just 10 minutes and watch your progress compound over time."
                    },
                    {
                      icon: <Zap className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />,
                      title: "Stay Consistently Focused",
                      description: "Gentle timers and check-ins keep you on track without pressure or burnout."
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="flex gap-4 p-6 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                      {benefit.icon}
                      <div>
                        <h3 className="font-bold text-slate-900 mb-2 text-lg">{benefit.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="mt-10 text-lg px-8 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <a href="/capture">Try It Free Today</a>
                </Button>
              </div>

              <div className="lg:pl-8 animate-in fade-in duration-1000 delay-300">
                <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl p-12 border-2 border-emerald-200 relative overflow-hidden group hover:border-emerald-400 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative text-center">
                    <div className="text-7xl lg:text-8xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-transparent bg-clip-text mb-4">
                      10
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6">Minutes to Progress</div>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      The perfect amount of time to make meaningful progress without feeling overwhelmed or losing focus. Research-backed productivity.
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                    <div className="text-3xl font-bold text-emerald-600">∞</div>
                    <p className="text-sm text-slate-600 mt-2 font-medium">Scalable</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                    <div className="text-3xl font-bold text-teal-600">💡</div>
                    <p className="text-sm text-slate-600 mt-2 font-medium">Smart</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                    <div className="text-3xl font-bold text-cyan-600">🎯</div>
                    <p className="text-sm text-slate-600 mt-2 font-medium">Focused</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
          
          <div className="relative container mx-auto px-4 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Reclaim Your Productivity?</h2>
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto mb-10">
              Join thousands breaking down their overwhelm. Start your first 10-minute session today—no credit card required.
            </p>
            <Button
              size="lg"
              className="text-lg px-10 py-7 bg-white text-emerald-600 hover:bg-slate-100 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              asChild
            >
              <a href="/capture">Start Breaking Down Tasks</a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
