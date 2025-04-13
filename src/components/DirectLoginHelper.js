import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { directGoogleLogin } from '../lib/auth';

function DirectLoginHelper() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setStatus('Please enter an authorization code');
      return;
    }

    setIsLoading(true);
    setStatus('Authenticating...');

    try {
      await directGoogleLogin(code.trim());
      setStatus('Login successful! Redirecting...');
      
      // Short delay for user to see success message
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    } catch (error) {
      console.error('Direct login failed:', error);
      setStatus(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg mt-10">
      <h2 className="text-xl font-bold text-white mb-4">Direct Google Login</h2>
      
      <p className="text-gray-300 mb-4">
        Use this form to directly login with a Google authorization code.
        <br />
        <span className="text-xs opacity-70">
          For use with: curl --location 'http://localhost:3000/auth/google' with code in request body
        </span>
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="directCode" className="block text-sm font-medium text-gray-300 mb-1">
            Authorization Code
          </label>
          <input
            id="directCode"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            placeholder="Paste your authorization code here"
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !code.trim()}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-medium rounded-md transition-colors"
        >
          {isLoading ? 'Processing...' : 'Login'}
        </button>
        
        {status && (
          <div className={`text-sm p-2 rounded ${status.includes('failed') ? 'bg-red-800 text-red-100' : status.includes('successful') ? 'bg-green-800 text-green-100' : 'bg-blue-800 text-blue-100'}`}>
            {status}
          </div>
        )}
        
        <div className="text-xs text-gray-400 mt-4">
          <p>Example curl command:</p>
          <pre className="bg-gray-900 p-2 rounded overflow-x-auto text-gray-300 mt-1">
            {`curl --location 'http://localhost:3000/auth/google' \\
  --header 'Content-Type: application/json' \\
  --data '{ "code": "YOUR_AUTHORIZATION_CODE" }'`}
          </pre>
        </div>
      </form>
    </div>
  );
}

export default DirectLoginHelper; 