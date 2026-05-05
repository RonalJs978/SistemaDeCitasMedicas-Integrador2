import { Navbar, Sidebar } from './components'


function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <Sidebar />

      <main className="flex-1 ml-64 mt-16 p-8">
        <div className="max-w-6xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-gray-600">Select an option from the sidebar to get started</p>
        </div>
      </main>
    </div>
  )
}

export default App
