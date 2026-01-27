import { createHome } from "../actions/home"

export default function SetupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border">
        <h1 className="text-2xl font-bold mb-2">Almost there!</h1>
        <p className="text-gray-600 mb-6">Give your home a nickname to get started.</p>
        
        <form action={createHome} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Home Nickname</label>
            <input 
              name="nickname"
              required
              placeholder="e.g. My Apartment, The Batcave"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Create My Home
          </button>
        </form>
      </div>
    </div>
  )
}