import { Github, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "./components/ui/button"

function App() {
  return (
    <section
      id="about"
      className="relative min-h-[100vh] flex items-center bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-gray-900">
                Hi, I'm{" "}
                <span className="relative inline-block">
                  <span className="animate-wave inline-block">Prakash</span>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </span>
              </h1>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-gradient">
                Full Stack Developer & Security Engineer
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Crafting secure and scalable digital solutions with a passion
                for clean code and innovative technology.
              </p>
            </div>

            <div className="flex flex-col gap-4 text-lg text-gray-700">
              <div className="flex items-center gap-3 group cursor-pointer hover:text-purple-600 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                  <MapPin className="w-5 h-5 text-gray-700 group-hover:text-purple-600" />
                </div>
                <span>Rajasthan, India</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer hover:text-purple-600 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                  <Mail className="w-5 h-5 text-gray-700 group-hover:text-purple-600" />
                </div>
                <span>itsprakashsolanki@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer hover:text-purple-600 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                  <Phone className="w-5 h-5 text-gray-700 group-hover:text-purple-600" />
                </div>
                <span>+91 9571053615</span>
              </div>
            </div>

            <div className="flex gap-6">
              <a href="https://wa.me/+919571053615" target="_blank" rel="noopener noreferrer">
                <Button className="!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Let's Connect
                </Button>
              </a>
              <a href="https://prakashsolanki.notion.site" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="!rounded-button whitespace-nowrap cursor-pointer border-2 hover:bg-gray-50 transition-colors"
                >
                  Download CV
                </Button>
              </a>
            </div>

            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/prakasolanki"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-lg bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-purple-600 hover:shadow-lg transition-all duration-300"
              >
                <Linkedin className="w-5 h-5 text-gray-700 group-hover:text-purple-600" />
              </a>
              <a
                href="https://github.com/prakashsolanki28"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-lg bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-purple-600 hover:shadow-lg transition-all duration-300"
              >
                <Github className="w-5 h-5 text-gray-700 group-hover:text-purple-600" />
              </a>
              <a
                href="https://www.instagram.com/prakaasolanki/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-lg bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-purple-600 hover:shadow-lg transition-all duration-300"
              >
                <Instagram className="w-5 h-5 text-gray-700 group-hover:text-purple-600" />
              </a>
            </div>
          </div>

          <div className="relative">
            <img
              src="./desk.jpg"
              alt="Professional Workspace"
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default App