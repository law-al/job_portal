'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { refreshAccessToken } from '@/lib/refreshToken';
import { toast } from 'sonner';
import { formatDistanceToNowStrict } from 'date-fns';

interface ResumeAnalysisResult {
  profile_summary: string;
  strengths: string[];
  weaknesses: string[];
  skill_gaps: string[];
  acceptance_percentage: number;
  acceptance_level: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
  reason_for_score: string;
  improvement_suggestions: string[];
}

interface AIApplicationReviewProps {
  applicationId: string;
  resumeUrl: string | null;
}

const AIApplicationReview = ({ applicationId, resumeUrl }: AIApplicationReviewProps) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [analyzedAt, setAnalyzedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasMounted = useRef(false);

  const fetchAnalysis = useCallback(async () => {
    console.log('fetching analysis', resumeUrl, applicationId);
    if (!resumeUrl || !applicationId) {
      setError('Resume URL or Application ID is missing');
      return;
    }

    if (!session?.user) {
      setError('Please log in to view AI analysis');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const accessToken = (session.user as any)?.accessToken;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const refreshTokenHash = (session.user as any)?.refreshTokenHash;

      const makeRequest = async (token: string) => {
        console.log('making request', resumeUrl, applicationId);
        const response = await fetchWithRetry({
          url: 'ai/resume/analyze',
          options: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify({
              resumeUrl,
              applicationId,
            }),
          },
          refreshTokenHash,
        });

        console.log('response', response);

        if (!response.ok) {
          console.log('error', response);
          const errorData = await response.json().catch(() => ({ message: 'Failed to analyze resume' }));
          throw new Error(errorData.message || 'Failed to analyze resume');
        }

        const result = await response.json();
        return result.data;
      };

      const data = await makeRequest(accessToken);

      setAnalysis(data as ResumeAnalysisResult);
      setAnalyzedAt(new Date());
      toast.success('AI analysis completed successfully');
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (err as any)?.message || 'Failed to analyze resume';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [resumeUrl, applicationId, session]);

  useEffect(() => {
    if (!hasMounted.current) {
      console.log('session changed');
      if (resumeUrl && applicationId && session?.user) {
        hasMounted.current = true;
        fetchAnalysis();
      }
    }
  }, [resumeUrl, applicationId, session, fetchAnalysis]);

  const getAcceptanceLevelColor = (level: string) => {
    switch (level) {
      case 'Very High':
        return 'text-green-600';
      case 'High':
        return 'text-green-600';
      case 'Moderate':
        return 'text-yellow-600';
      case 'Low':
        return 'text-orange-600';
      case 'Very Low':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAcceptanceLevelStrokeColor = (level: string) => {
    switch (level) {
      case 'Very High':
        return '#10b981'; // green-600
      case 'High':
        return '#10b981'; // green-600
      case 'Moderate':
        return '#eab308'; // yellow-600
      case 'Low':
        return '#ea580c'; // orange-600
      case 'Very Low':
        return '#dc2626'; // red-600
      default:
        return '#4b5563'; // gray-600
    }
  };

  const percentage = analysis?.acceptance_percentage ?? 0;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference * (1 - percentage / 100);

  if (!resumeUrl) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="font-semibold text-gray-900">AI Application Review</h2>
        </div>
        <p className="text-gray-600 text-sm">No resume available for analysis.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="font-semibold text-gray-900">AI Application Review</h2>
        </div>
        <div className="flex items-center gap-3">
          {analyzedAt && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Analyzed {formatDistanceToNowStrict(analyzedAt, { addSuffix: true })}
            </div>
          )}
          <button
            onClick={fetchAnalysis}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Re-run Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {loading && !analysis && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <p className="text-gray-600 text-sm">Analyzing resume...</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {analysis && !loading && (
        <>
          {/* Executive Summary */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Executive Summary</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{analysis.profile_summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Side - Score and Qualification */}
            <div className="space-y-4">
              {/* Match Score */}
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke={getAcceptanceLevelStrokeColor(analysis.acceptance_level)}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-bold ${getAcceptanceLevelColor(analysis.acceptance_level)}`}>{percentage}%</span>
                    <span className="text-xs text-gray-600">MATCH</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className={`w-5 h-5 ${getAcceptanceLevelColor(analysis.acceptance_level)}`} />
                    <span className={`font-semibold ${getAcceptanceLevelColor(analysis.acceptance_level)}`}>{analysis.acceptance_level}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{analysis.reason_for_score}</p>
                </div>
              </div>
            </div>

            {/* Right Side - Strengths and Concerns */}
            <div className="space-y-4">
              {/* Key Strengths */}
              {analysis.strengths.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <h4 className="font-semibold text-gray-900 text-sm">KEY STRENGTHS</h4>
                  </div>
                  <ul className="space-y-1.5 ml-6">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Potential Concerns */}
              {(analysis.weaknesses.length > 0 || analysis.skill_gaps.length > 0) && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <h4 className="font-semibold text-gray-900 text-sm">POTENTIAL CONCERNS</h4>
                  </div>
                  <ul className="space-y-1.5 ml-6">
                    {analysis.weaknesses.map((weakness, index) => (
                      <li key={`weakness-${index}`} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-orange-600 font-bold">▲</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                    {analysis.skill_gaps.map((gap, index) => (
                      <li key={`gap-${index}`} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-orange-600 font-bold">▲</span>
                        <span>Skill gap: {gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvement Suggestions */}
              {analysis.improvement_suggestions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <h4 className="font-semibold text-gray-900 text-sm">IMPROVEMENT SUGGESTIONS</h4>
                  </div>
                  <ul className="space-y-1.5 ml-6">
                    {analysis.improvement_suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIApplicationReview;
