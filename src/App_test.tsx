import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🗺️ Micro Adventure App
        </h1>
        <p className="text-lg text-gray-600">
          App is working! This means the issue is in one of the components.
        </p>
        <div className="mt-8 p-4 bg-green-100 rounded-lg">
          <p className="text-green-800">✅ React is loaded</p>
          <p className="text-green-800">✅ Tailwind CSS is working</p>
          <p className="text-green-800">✅ Basic rendering is functional</p>
        </div>
      </div>
    </div>
  );
}

export default App;
