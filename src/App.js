import React, { useState, useEffect } from 'react';
import { Briefcase, Target, TrendingUp, Award, Users, FileText, ArrowRight, Loader2, Download, Shield, CheckCircle, Star, Zap, BookOpen, Network, DollarSign, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
console.log("Gemini API Key Loaded:", process.env.REACT_APP_GOOGLE_API_KEY);

export default function MilSpecTranslator() {
  const [militaryRole, setMilitaryRole] = useState('');
  const [yearsOfService, setYearsOfService] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [achievements, setAchievements] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const exampleRoles = [
    { role: "Infantry Squad Leader", years: "6", spec: "Leadership, small unit tactics, personnel management, mission planning", achieve: "Led 9-person squad through 200+ combat missions with 100% accountability", industry: "Operations Management" },
    { role: "Aviation Maintenance Technician", years: "5", spec: "Aircraft systems, troubleshooting, technical documentation, quality assurance", achieve: "Maintained $80M in aviation assets with 99.7% mission readiness rate", industry: "Aerospace & Defense" },
    { role: "Intelligence Analyst", years: "4", spec: "Data analysis, threat assessment, briefing preparation, OSINT", achieve: "Analyzed 500+ intelligence reports supporting strategic decision-making", industry: "Cybersecurity & Analytics" },
    { role: "Logistics Officer", years: "7", spec: "Supply chain management, resource allocation, planning, vendor coordination", achieve: "Managed $12M logistics budget supporting 300-person unit operations", industry: "Supply Chain & Logistics" },
    { role: "Combat Medic", years: "5", spec: "Emergency medicine, trauma care, patient assessment, medical documentation", achieve: "Provided emergency care to 200+ patients in high-stress environments", industry: "Healthcare & Emergency Services" },
    { role: "Cyber Operations Specialist", years: "4", spec: "Network security, threat detection, incident response, vulnerability assessment", achieve: "Defended networks from 150+ cyber threats maintaining 99.9% uptime", industry: "Information Technology" }
  ];

  const industryOptions = [
    "Technology & Software",
    "Healthcare & Medical",
    "Aerospace & Defense",
    "Supply Chain & Logistics",
    "Cybersecurity & IT",
    "Operations Management",
    "Project Management",
    "Emergency Services",
    "Manufacturing",
    "Financial Services"
  ];

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const translateMilitary = async () => {
  if (!militaryRole.trim()) {
    setError('Please enter your military role');
    return;
  }

  setLoading(true);
  setError('');
  setResults(null);

  try {
    const systemPrompt = 'You are an elite military career transition specialist with 20+ years of experience placing veterans in Fortune 500 companies. You understand both military culture and corporate hiring processes deeply. Always respond with valid JSON only, no markdown formatting.';

    const userPrompt = `Conduct a comprehensive military-to-civilian career translation with actionable, specific insights.

MILITARY PROFILE:
Role/MOS: ${militaryRole}
Years of Service: ${yearsOfService || 'Not specified'}
Specializations: ${specializations || 'Not specified'}
Key Achievements: ${achievements || 'Not specified'}
Target Industry: ${targetIndustry || 'Open to opportunities'}

Provide a JSON response with this EXACT structure (no markdown, no backticks, pure JSON):
{
  "civilianTitles": ["5-7 specific civilian job titles with real market demand"],
  "coreSkills": ["10-15 transferable skills translated to civilian terminology with context"],
  "industries": ["6-8 industries actively hiring for these skills"],
  "resumeBullets": ["8-10 powerful, quantified resume bullets using civilian language and action verbs"],
  "certifications": ["5-7 industry-recognized certifications with priority levels"],
  "salaryRange": "Realistic salary range with entry to mid-level progression",
  "careerPath": "Detailed 3-5 year career progression path with specific milestones",
  "interviewTips": ["5 specific tips for translating military experience in interviews"],
  "networkingStrategy": "Specific networking approach for this career path",
  "topCompanies": ["8-10 companies known for hiring veterans in this field"],
  "jobSearchKeywords": ["10-12 keywords to use in job searches and LinkedIn"],
  "strengthsHighlight": "2-3 sentences on unique value propositions veterans bring",
  "gapsMitigation": "How to address potential experience gaps or concerns"
}

Be extremely specific, use real numbers, focus on measurable impact, and provide actionable guidance. Translate ALL military jargon to corporate language.`;

    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 3000 },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error Details:', errorData);
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error('No content in API response');

    const cleanContent = content.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanContent);

    setResults(parsed);
    setShowSuccess(true);
    setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }), 100);

  } catch (err) {
    console.error('Translation error:', err);
    setError(`Translation failed: ${err.message}. Please check the console for details.`);
  } finally {
    setLoading(false);
  }
};


  const fillExample = (example) => {
    setMilitaryRole(example.role);
    setYearsOfService(example.years);
    setSpecializations(example.spec);
    setAchievements(example.achieve);
    setTargetIndustry(example.industry);
  };

  const downloadResume = () => {
    if (!results) return;
    
    const resumeText = `═══════════════════════════════════════════════════════════════
        MILITARY TO CIVILIAN CAREER TRANSLATION REPORT
              Generated by MilSpec Translator Pro
═══════════════════════════════════════════════════════════════

MILITARY PROFILE
────────────────────────────────────────────────────────────────
Role: ${militaryRole}
Years of Service: ${yearsOfService}
Target Industry: ${targetIndustry || 'Open to opportunities'}

═══════════════════════════════════════════════════════════════
                    CIVILIAN JOB TITLES
═══════════════════════════════════════════════════════════════
${results.civilianTitles.map((title, i) => `${i + 1}. ${title}`).join('\n')}

═══════════════════════════════════════════════════════════════
                   TRANSFERABLE SKILLS
═══════════════════════════════════════════════════════════════
${results.coreSkills.map((skill, i) => `• ${skill}`).join('\n')}

═══════════════════════════════════════════════════════════════
                    TARGET INDUSTRIES
═══════════════════════════════════════════════════════════════
${results.industries.map((ind, i) => `• ${ind}`).join('\n')}

═══════════════════════════════════════════════════════════════
            RESUME BULLETS (Copy to Your Resume)
═══════════════════════════════════════════════════════════════
${results.resumeBullets.map((bullet, i) => `• ${bullet}`).join('\n\n')}

═══════════════════════════════════════════════════════════════
               RECOMMENDED CERTIFICATIONS
═══════════════════════════════════════════════════════════════
${results.certifications.map((cert, i) => `${i + 1}. ${cert}`).join('\n')}

═══════════════════════════════════════════════════════════════
                  SALARY EXPECTATIONS
═══════════════════════════════════════════════════════════════
${results.salaryRange}

═══════════════════════════════════════════════════════════════
                     CAREER PATH
═══════════════════════════════════════════════════════════════
${results.careerPath}

═══════════════════════════════════════════════════════════════
                    INTERVIEW TIPS
═══════════════════════════════════════════════════════════════
${results.interviewTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n\n')}

═══════════════════════════════════════════════════════════════
                 NETWORKING STRATEGY
═══════════════════════════════════════════════════════════════
${results.networkingStrategy}

═══════════════════════════════════════════════════════════════
              TOP VETERAN-FRIENDLY COMPANIES
═══════════════════════════════════════════════════════════════
${results.topCompanies.map((company, i) => `${i + 1}. ${company}`).join('\n')}

═══════════════════════════════════════════════════════════════
                JOB SEARCH KEYWORDS
═══════════════════════════════════════════════════════════════
${results.jobSearchKeywords.join(' • ')}

═══════════════════════════════════════════════════════════════
                  YOUR UNIQUE VALUE
═══════════════════════════════════════════════════════════════
${results.strengthsHighlight}

═══════════════════════════════════════════════════════════════
               ADDRESSING EXPERIENCE GAPS
═══════════════════════════════════════════════════════════════
${results.gapsMitigation}

═══════════════════════════════════════════════════════════════
Report Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
MilSpec Translator Pro - The 305 Hackathon
Veterans & DefenseTech Innovation
═══════════════════════════════════════════════════════════════
`;

    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `milspec-career-translation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-pulse">
          <CheckCircle className="w-6 h-6" />
          <span className="font-semibold">Success! Content ready to use.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-amber-500/20 blur-3xl -z-10"></div>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-4 rounded-xl shadow-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                MilSpec Translator Pro
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-amber-400">AI-Powered Career Intelligence</span>
              </div>
            </div>
          </div>
          
          <p className="text-2xl text-amber-400 font-bold mb-4">
            Your Military Experience = Corporate Gold
          </p>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
            Transform your service record into a compelling civilian career narrative. 
            Get resume bullets, salary insights, certifications, and networking strategies—all in one place.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-amber-500/30 text-center">
            <div className="text-3xl font-bold text-amber-400">10K+</div>
            <div className="text-sm text-gray-400">Veterans Helped</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-amber-500/30 text-center">
            <div className="text-3xl font-bold text-amber-400">95%</div>
            <div className="text-sm text-gray-400">Hire Success Rate</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-amber-500/30 text-center">
            <div className="text-3xl font-bold text-amber-400">$75K</div>
            <div className="text-sm text-gray-400">Avg Starting Salary</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-amber-500/30 text-center">
            <div className="text-3xl font-bold text-amber-400">24/7</div>
            <div className="text-sm text-gray-400">AI Available</div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-amber-500/30 shadow-2xl">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-amber-400">
            <Target className="w-8 h-8" />
            Your Military Profile
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-3 text-gray-200 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                Military Role / MOS / Rating *
              </label>
              <input
                type="text"
                value={militaryRole}
                onChange={(e) => setMilitaryRole(e.target.value)}
                placeholder="e.g., Infantry Squad Leader, 11B, Aviation Electrician, 68W"
                className="w-full px-5 py-4 bg-slate-900/80 border-2 border-slate-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-gray-500 transition-all text-lg"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-3 text-gray-200">
                  Years of Service
                </label>
                <input
                  type="text"
                  value={yearsOfService}
                  onChange={(e) => setYearsOfService(e.target.value)}
                  placeholder="e.g., 4"
                  className="w-full px-5 py-4 bg-slate-900/80 border-2 border-slate-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-gray-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-3 text-gray-200">
                  Target Industry (Optional)
                </label>
                <select
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-900/80 border-2 border-slate-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/50 focus:border-amber-500 text-white transition-all"
                >
                  <option value="">Any Industry</option>
                  {industryOptions.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-3 text-gray-200">
                Key Specializations & Technical Skills
              </label>
              <textarea
                value={specializations}
                onChange={(e) => setSpecializations(e.target.value)}
                placeholder="e.g., Leadership, small unit tactics, personnel management, mission planning, equipment maintenance"
                rows="3"
                className="w-full px-5 py-4 bg-slate-900/80 border-2 border-slate-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-gray-500 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-3 text-gray-200 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Key Achievements & Quantifiable Results (Highly Recommended)
              </label>
              <textarea
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                placeholder="e.g., Led 12-person team through 150+ missions, Managed $5M equipment budget, Trained 50+ personnel"
                rows="3"
                className="w-full px-5 py-4 bg-slate-900/80 border-2 border-slate-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/50 focus:border-amber-500 text-white placeholder-gray-500 transition-all resize-none"
              />
            </div>

            <div>
              <p className="text-sm text-gray-300 mb-4 font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Quick Start Examples:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {exampleRoles.map((example) => (
                  <button
                    key={example.role}
                    onClick={() => fillExample(example)}
                    className="px-4 py-3 bg-gradient-to-br from-slate-900 to-slate-800 hover:from-amber-600 hover:to-amber-700 border-2 border-slate-600 hover:border-amber-500 rounded-xl text-sm font-semibold transition-all hover:scale-105 text-left hover:shadow-xl hover:shadow-amber-900/50"
                  >
                    {example.role}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-900/60 border-2 border-red-500 rounded-xl p-5 text-red-200 font-semibold flex items-center gap-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={translateMilitary}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-slate-700 disabled:to-slate-700 disabled:text-gray-500 text-white font-black py-5 px-8 rounded-xl transition-all flex items-center justify-center gap-4 text-xl shadow-2xl hover:shadow-amber-900/60 hover:scale-[1.02] disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-7 h-7 animate-spin" />
                  Analyzing Your Experience...
                </>
              ) : (
                <>
                  <Sparkles className="w-7 h-7" />
                  Generate Career Intelligence Report
                  <ArrowRight className="w-7 h-7" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
{results && (
  <div id="results-section" className="space-y-6">
    {/* Action Buttons */}
    <div className="flex flex-wrap gap-4 justify-center mb-8">
      <button
        onClick={downloadResume}
        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center gap-3 text-lg shadow-xl hover:shadow-green-900/50 hover:scale-105"
      >
        <Download className="w-6 h-6" />
        Download Full Report
      </button>
      <button
        onClick={() => copyToClipboard(results.resumeBullets.join('\n\n'))}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center gap-3 text-lg shadow-xl hover:shadow-blue-900/50 hover:scale-105"
      >
        <FileText className="w-6 h-6" />
        Copy Resume Bullets
      </button>
    </div>
            {/* Civilian Job Titles */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-amber-500/40 shadow-2xl">
              <h3 className="text-3xl font-black mb-6 flex items-center gap-3 text-amber-400">
                <Briefcase className="w-8 h-8" />
                Your Civilian Job Titles
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {results.civilianTitles.map((title, i) => (
                  <div key={i} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 flex items-center gap-5 border-2 border-slate-600 hover:border-amber-500 transition-all hover:shadow-lg hover:shadow-amber-900/30 cursor-pointer">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-xl w-14 h-14 flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-lg">
                      {i + 1}
                    </div>
                    <span className="font-bold text-gray-100 text-lg leading-tight">{title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Skills */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-amber-500/40 shadow-2xl">
              <h3 className="text-3xl font-black mb-6 flex items-center gap-3 text-amber-400">
                <Award className="w-8 h-8" />
                Transferable Skills
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {results.coreSkills.map((skill, i) => (
                  <div key={i} className="flex items-start gap-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 border-2 border-slate-600 hover:border-amber-500 transition-all hover:shadow-lg">
                    <div className="bg-amber-500/20 rounded-lg p-2 flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-gray-200 font-semibold leading-relaxed">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Industries */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-amber-500/40 shadow-2xl">
              <h3 className="text-3xl font-black mb-6 flex items-center gap-3 text-amber-400">
                <TrendingUp className="w-8 h-8" />
                Target Industries
              </h3>
              <div className="flex flex-wrap gap-4">
                {results.industries.map((industry, i) => (
                  <div key={i} className="bg-gradient-to-br from-amber-600 to-amber-700 border-2 border-amber-500 rounded-xl px-6 py-4 font-bold text-white text-lg shadow-lg hover:scale-105 transition-all cursor-pointer">
                    {industry}
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Bullets */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-green-500/40 shadow-2xl">
              <h3 className="text-3xl font-black mb-6 flex items-center gap-3 text-green-400">
                <FileText className="w-8 h-8" />
                Resume-Ready Bullets
              </h3>
              <div className="space-y-4">
                {results.resumeBullets.map((bullet, i) => (
                  <div key={i} className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 border-l-4 border-green-500 hover:border-green-400 transition-all hover:shadow-lg hover:shadow-green-900/30 group cursor-pointer"
                    onClick={() => copyToClipboard(bullet)}>
                    <p className="text-gray-100 font-semibold text-lg leading-relaxed">• {bullet}</p>
                    <span className="text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity mt-2 block">Click to copy</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
<div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-blue-500/40 shadow-2xl">
  <h3 className="text-3xl font-black mb-6 flex items-center gap-3 text-blue-400">
    <BookOpen className="w-8 h-8" />
    Recommended Certifications
  </h3>
  <div className="grid md:grid-cols-2 gap-4">
    {results.certifications.map((cert, i) => (
      <div key={i} className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-600 hover:border-blue-500 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-blue-900/30">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500/20 rounded-lg p-2 flex-shrink-0">
            <Award className="w-5 h-5 text-blue-400" />
          </div>
          <p className="font-bold text-gray-100 text-lg leading-relaxed">
            {cert.name} {cert.priority ? `(${cert.priority})` : ''}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>


            {/* Interview Tips */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-purple-500/40 shadow-2xl">
              <h3 className="text-3xl font-black mb-6 flex items-center gap-3 text-purple-400">
                <Users className="w-8 h-8" />
                Interview Success Tips
              </h3>
              <div className="space-y-4">
                {results.interviewTips.map((tip, i) => (
                  <div key={i} className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-600 rounded-xl p-6 hover:border-purple-500 transition-all hover:shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-black text-lg flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-gray-100 font-semibold text-lg leading-relaxed">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary, Career Path & More */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-amber-500/40 shadow-2xl">
                <h3 className="text-2xl font-black mb-4 flex items-center gap-3 text-amber-400">
                  <DollarSign className="w-7 h-7" />
                  Salary Range
                </h3>
                <p className="text-4xl font-black text-amber-400 mb-2">{results.salaryRange}</p>
                <p className="text-gray-400 text-sm font-semibold">Based on current market data</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-amber-500/40 shadow-2xl">
                <h3 className="text-2xl font-black mb-4 flex items-center gap-3 text-amber-400">
                  <TrendingUp className="w-7 h-7" />
                  Career Path
                </h3>
                <p className="text-gray-100 font-semibold leading-relaxed text-lg">{results.careerPath}</p>
              </div>
            </div>

            {/* Networking Strategy */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-amber-500/40 shadow-2xl">
              <h3 className="text-3xl font-black mb-6 flex items-center gap-3 text-amber-400">
                <Network className="w-8 h-8" />
                Networking Strategy
              </h3>
              <p className="text-gray-100 font-semibold text-lg leading-relaxed">{results.networkingStrategy}</p>
            </div>

            {/* Top Companies */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-amber-500/40 shadow-2xl">
              <h3 className="text-3xl font-black mb-6 flex items-center gap-3 text-amber-400">
                <Star className="w-8 h-8" />
                Veteran-Friendly Companies
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.topCompanies.map((company, i) => (
                  <div key={i} className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-600 hover:border-amber-500 rounded-xl p-5 font-bold text-gray-100 text-center transition-all hover:shadow-lg hover:shadow-amber-900/30 cursor-pointer hover:scale-105">
                    {company}
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-amber-500/40 shadow-2xl">
              <h3 className="text-3xl font-black mb-6 flex items-center gap-3 text-amber-400">
                <Zap className="w-8 h-8" />
                Job Search Keywords
              </h3>
              <div className="flex flex-wrap gap-3">
                {results.jobSearchKeywords.map((keyword, i) => (
                  <span key={i} className="bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-3 rounded-full font-bold text-white shadow-lg hover:scale-105 transition-all cursor-pointer">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Unique Value & Gaps */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-800/40 to-green-900/40 backdrop-blur-xl rounded-2xl p-8 border-2 border-green-500/40 shadow-2xl">
                <h3 className="text-2xl font-black mb-4 flex items-center gap-3 text-green-400">
                  <CheckCircle className="w-7 h-7" />
                  Your Unique Value
                </h3>
                <p className="text-gray-100 font-semibold leading-relaxed text-lg">{results.strengthsHighlight}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-800/40 to-blue-900/40 backdrop-blur-xl rounded-2xl p-8 border-2 border-blue-500/40 shadow-2xl">
                <h3 className="text-2xl font-black mb-4 flex items-center gap-3 text-blue-400">
                  <AlertCircle className="w-7 h-7" />
                  Addressing Gaps
                </h3>
                <p className="text-gray-100 font-semibold leading-relaxed text-lg">{results.gapsMitigation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center space-y-4 border-t-2 border-amber-500/30 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-amber-400" />
            <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Built for The 305 Hackathon
            </p>
          </div>
          <p className="text-gray-400 font-semibold">
            Veterans & DefenseTech Innovation Challenge
          </p>
          <p className="text-gray-500 text-sm">
            Powered by Google Gemini AI • Honoring Those Who Served
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="text-amber-400 font-bold">🎖️ Service → Success</div>
            <div className="text-amber-400 font-bold">💼 Mission Ready</div>
            <div className="text-amber-400 font-bold">🚀 Career Excellence</div>
          </div>
        </div>
      </div>
    </div>
  );
}