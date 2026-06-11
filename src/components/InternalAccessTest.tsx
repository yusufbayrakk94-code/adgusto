import React, { useState } from 'react';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { checkInternalAccess } from '../services/internalGoogleAdsService';
import { auth } from '../config/firebase';

export default function InternalAccessTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runTest = async () => {
    setTesting(true);
    setResult(null);

    try {
      console.log('=== Internal Access Test Starting ===');

      // Check Firebase auth
      const user = auth.currentUser;
      console.log('Firebase User:', user?.email);

      if (!user) {
        setResult({ error: 'No Firebase user found. Please sign in first.' });
        setTesting(false);
        return;
      }

      // Check environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      console.log('Supabase URL:', supabaseUrl);
      console.log('Supabase Key exists:', !!supabaseKey);

      if (!supabaseUrl || !supabaseKey) {
        setResult({ error: 'Supabase credentials missing from environment variables' });
        setTesting(false);
        return;
      }

      // Test internal access
      console.log('Testing internal access...');
      const accessResult = await checkInternalAccess();
      console.log('Access result:', accessResult);

      setResult(accessResult);
    } catch (error) {
      console.error('Test error:', error);
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary/10 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-dark" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-dark">Internal Access Test</h1>
              <p className="text-sm text-gray">Diagnose whitelist access issues</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-dark mb-2">Current User</h3>
            <p className="text-sm text-gray">{auth.currentUser?.email || 'Not signed in'}</p>
          </div>

          <button
            onClick={runTest}
            disabled={testing}
            className="w-full bg-primary hover:bg-primary/90 text-dark font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Run Access Test'}
          </button>

          {result && (
            <div className="mt-6">
              {result.isWhitelisted ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-bold text-green-900 mb-2">Access Granted</h3>
                      <p className="text-sm text-green-700 mb-2">
                        You are whitelisted for internal tools!
                      </p>
                      {result.user && (
                        <div className="text-sm text-green-700">
                          <p><strong>Name:</strong> {result.user.fullName}</p>
                          <p><strong>Email:</strong> {result.user.email}</p>
                          <p><strong>Role:</strong> {result.user.role}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-bold text-red-900 mb-2">Access Denied</h3>
                      <p className="text-sm text-red-700 mb-2">
                        {result.error || 'You are not whitelisted for internal tools.'}
                      </p>
                      <div className="mt-3 p-3 bg-red-100 rounded-lg">
                        <p className="text-xs font-mono text-red-800">
                          {JSON.stringify(result, null, 2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <h4 className="font-bold text-sm text-dark mb-2">Debug Info</h4>
                <div className="text-xs font-mono text-gray-700">
                  <p>Firebase User: {auth.currentUser?.email || 'None'}</p>
                  <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL || 'Missing'}</p>
                  <p>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">Instructions</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Make sure you're signed in with your Firebase account</li>
              <li>Click "Run Access Test" to check whitelist status</li>
              <li>Check browser console (F12) for detailed logs</li>
              <li>If access is denied, verify your email is in the internal_whitelist table</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
