import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="navbar bg-base-100 rounded-box shadow-xl mb-4">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">My DaisyUI App</a>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Welcome!</h2>
          <p>Your DaisyUI app is ready to go!</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App