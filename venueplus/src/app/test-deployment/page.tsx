export default function TestDeploymentPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Deployment Working!</h1>
        <p className="text-gray-700 mb-4">
          If you can see this page, your Vercel deployment is working correctly.
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Next.js:</strong> ✅ Working</p>
          <p><strong>Routing:</strong> ✅ Working</p>
          <p><strong>Static Generation:</strong> ✅ Working</p>
        </div>
        <div className="mt-6">
          <a 
            href="/" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  )
}
