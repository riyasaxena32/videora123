import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { handleGoogleLogin } = useAuth();

  // Handle Google login success
  const onGoogleLoginSuccess = (credentialResponse) => {
    console.log('Google login successful, exchanging for backend token');
    handleGoogleLogin(credentialResponse);
  };

  // Handle Google login error
  const onGoogleLoginError = () => {
    console.error('Google login failed');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#111] rounded-lg border border-[#333]">
        <div className="text-center">
          <img src="/Image2.png" alt="VIDEORA" className="h-10 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-2">Welcome to VIDEORA</h2>
          <p className="text-[#b0b0b0] mb-8">Sign in to continue to your account</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <GoogleLogin
              clientId="1035965460197-fingmcmt79qnhidf5j3iiubdb7ge2tas.apps.googleusercontent.com"
              onSuccess={onGoogleLoginSuccess}
              onError={onGoogleLoginError}
              useOneTap
              theme="filled_black"
              shape="pill"
              text="signin_with"
              size="large"
              width="300"
              locale="en"
              redirectUri="https://videora123.vercel.app/auth/google/callback"
            />
          </div>

          <div className="pt-4 text-center">
            <p className="text-sm text-[#777]">
              By continuing, you agree to VIDEORA's Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 