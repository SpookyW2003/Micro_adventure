import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🗺️ Micro Adventure
        </h1>
        <p className="text-gray-600 mb-6">
          Your app is loading successfully!
        </p>
        <div className="space-y-2 text-sm text-left bg-green-50 p-4 rounded">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            React is working
          </div>
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            Tailwind CSS is applied
          </div>
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            Components are rendering
          </div>
        </div>
        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Everything is working! 🎉
        </button>
      </div>
    </div>
  );
}

export default App;
