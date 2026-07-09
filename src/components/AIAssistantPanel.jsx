import React, { useState, useEffect } from 'react';
import { Sparkles, X, Key, Info, Copy, Check, AlertCircle, RefreshCw, Eye, Sparkle } from 'lucide-react';
import toast from 'react-hot-toast';

const AIAssistantPanel = ({
    onClose,
    uploadedMedia,
    currentMediaIndex,
    applySuggestion,
    showFirstComment,
    setShowFirstComment
}) => {
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
    const [tempKey, setTempKey] = useState(apiKey);
    const [isKeyEditing, setIsKeyEditing] = useState(!apiKey);
    const [tone, setTone] = useState('Exciting');
    const [goal, setGoal] = useState('Drive Engagement');
    const [platform, setPlatform] = useState('Instagram');
    const [hashtagsCount, setHashtagsCount] = useState('5-10');
    const [customPrompt, setCustomPrompt] = useState('');

    // UI states
    const [isGenerating, setIsGenerating] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [useMock, setUseMock] = useState(!apiKey);

    useEffect(() => {
        if (apiKey) {
            setUseMock(false);
        } else {
            setUseMock(true);
        }
    }, [apiKey]);

    const handleSaveKey = () => {
        const key = tempKey.trim();
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            setApiKey(key);
            setIsKeyEditing(false);
            setUseMock(false);
            toast.success('Gemini API key saved successfully!');
        } else {
            localStorage.removeItem('gemini_api_key');
            setApiKey('');
            setIsKeyEditing(true);
            setUseMock(true);
            toast.error('API key cleared. Switched to Mock AI mode.');
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setSuggestions([]);

        const hasImage = uploadedMedia.length > 0 && uploadedMedia[currentMediaIndex]?.url;
        let imageBase64 = null;
        let mimeType = 'image/jpeg';

        if (hasImage) {
            const mediaItem = uploadedMedia[currentMediaIndex];
            mimeType = mediaItem.type || 'image/jpeg';
            const url = mediaItem.url;
            if (url.startsWith('data:')) {
                imageBase64 = url.split(',')[1];
            }
        }

        if (useMock || !apiKey) {
            // Simulate API request delay
            setTimeout(() => {
                const mockResults = generateMockSuggestions(tone, goal, platform, hashtagsCount, customPrompt, hasImage);
                setSuggestions(mockResults);
                setIsGenerating(false);
                toast.success('Mock AI suggestions generated!');
            }, 1500);
            return;
        }

        try {
            const model = 'gemini-1.5-flash';
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            let promptText = `You are a social media copywriter and growth expert. Generate exactly 3 highly engaging, creative caption options and a separate list of optimized hashtags for a social media post.
Target Platform: ${platform}
Tone/Style: ${tone}
Goal/Call-To-Action: ${goal}
Hashtags Count requested: ${hashtagsCount}
${customPrompt ? `Additional instructions/context from the user: "${customPrompt}"` : ''}
${hasImage ? 'An image is attached to this post. Please analyze the content/subject of this image and write captions highly specific to what is visible in the photo.' : ''}

You MUST return ONLY a valid JSON object matching the schema below. No markdown wrapping (like \`\`\`json), no preamble, no tailing text.
{
  "suggestions": [
    {
      "caption": "Creative caption option 1 here...",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
    },
    {
      "caption": "Creative caption option 2 here...",
      "hashtags": ["hashtag4", "hashtag5", "hashtag6"]
    },
    {
      "caption": "Creative caption option 3 here...",
      "hashtags": ["hashtag7", "hashtag8", "hashtag9"]
    }
  ]
}`;

            const parts = [{ text: promptText }];
            if (hasImage && imageBase64) {
                parts.push({
                    inlineData: {
                        mimeType: mimeType,
                        data: imageBase64
                    }
                });
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts }] })
            });

            if (!response.ok) {
                const errJson = await response.json().catch(() => ({}));
                throw new Error(errJson.error?.message || `HTTP ${response.status}`);
            }

            const resJson = await response.json();
            const textResponse = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';

            // Try to extract JSON from markdown if Gemini outputted it with backticks
            let cleanText = textResponse.trim();
            if (cleanText.includes('```json')) {
                cleanText = cleanText.split('```json')[1].split('```')[0].trim();
            } else if (cleanText.includes('```')) {
                cleanText = cleanText.split('```')[1].split('```')[0].trim();
            }

            let parsedData;
            try {
                parsedData = JSON.parse(cleanText);
            } catch (jsonErr) {
                // If JSON parsing failed, try manual regex fallback
                console.warn("Failed parsing JSON directly from Gemini, using regex extraction:", jsonErr);
                parsedData = parseTextFallback(textResponse);
            }

            if (!parsedData || !parsedData.suggestions || parsedData.suggestions.length === 0) {
                throw new Error("Could not parse caption suggestions from Gemini response.");
            }

            setSuggestions(parsedData.suggestions);
            toast.success('AI suggestions generated!');
        } catch (err) {
            console.error("AI Generation Error:", err);
            toast.error(`API Error: ${err.message}. Falling back to Mock AI.`);
            // Fallback immediately to mock
            const mockResults = generateMockSuggestions(tone, goal, platform, hashtagsCount, customPrompt, hasImage);
            setSuggestions(mockResults);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const generateMockSuggestions = (tone, goal, platform, hashtags, customPrompt, hasImage) => {
        // High quality rules-based mock data that adapts to selections
        const baseTopics = [
            "Bringing vision to reality. It's the small steps that lead to big milestones.",
            "Behind every great brand is a team that refuses to compromise on quality.",
            "Creating experiences, not just products. What drives your passion today?",
        ];

        let prefix = "";
        let suffix = "";
        let tags = [];

        if (tone === 'Exciting') {
            prefix = "🚀 Big moves today! ";
            suffix = " Let's make this week unforgettable! 🔥";
            tags = ["#LevelUp", "#GrowthMindset", "#Excitement", "#NextLevel"];
        } else if (tone === 'Professional') {
            prefix = "📈 Strategic execution. ";
            suffix = " Focused on long-term value and optimization.";
            tags = ["#BusinessStrategy", "#Leadership", "#ProfessionalGrowth", "#Innovation"];
        } else if (tone === 'Witty') {
            prefix = "☕ Ninety percent of coding is debugging. The other ten percent is staring at this post. ";
            suffix = " You're welcome. 😉";
            tags = ["#ProgrammerHumor", "#TechLife", "#WittyCaption", "#OfficeVibes"];
        } else if (tone === 'Informative') {
            prefix = "💡 Did you know? Consistent posting boosts organic visibility by 3x. ";
            suffix = " Here's your daily reminder to keep building.";
            tags = ["#KnowledgeIsPower", "#FactOfTheDay", "#LearnTech", "#SocialMediaTips"];
        } else {
            prefix = "✨ Striving for progress. ";
            suffix = " Hope everyone is having an amazing day!";
            tags = ["#DailyInspiration", "#Vibes", "#KeepGoing", "#GoodLife"];
        }

        if (platform === 'LinkedIn') {
            suffix += " #networking #industryinsights";
        }

        if (customPrompt) {
            prefix = `✨ Re: "${customPrompt}" — ` + prefix;
        }

        if (hasImage) {
            prefix = "📸 Photo details captured perfectly. " + prefix;
        }

        const list = [
            {
                caption: `${prefix}Option A: ${baseTopics[0]}${suffix}`,
                hashtags: [...tags, `#${platform}Growth`, `#${goal.replace(/\s+/g, '')}`]
            },
            {
                caption: `${prefix}Option B: ${baseTopics[1]}${suffix}`,
                hashtags: [...tags, `#MaximizeReach`, `#${tone}Tone`]
            },
            {
                caption: `${prefix}Option C: ${baseTopics[2]}${suffix}`,
                hashtags: [...tags, `#EngagementStrategy`, `#BuildPublic`]
            }
        ];

        return list;
    };

    const parseTextFallback = (text) => {
        // Basic fallback to parse standard lists or text
        const suggestions = [];
        const lines = text.split('\n');
        let currentCaption = '';
        let currentHashtags = [];

        for (let line of lines) {
            const trimmed = line.trim();
            if (trimmed.toLowerCase().includes('caption') && trimmed.includes(':')) {
                if (currentCaption) {
                    suggestions.push({ caption: currentCaption, hashtags: currentHashtags.length > 0 ? currentHashtags : ['#socialmedia', '#viral'] });
                    currentCaption = '';
                    currentHashtags = [];
                }
                currentCaption = trimmed.substring(trimmed.indexOf(':') + 1).replace(/"/g, '').trim();
            } else if (trimmed.toLowerCase().includes('hashtag') && trimmed.includes(':')) {
                const tagsStr = trimmed.substring(trimmed.indexOf(':') + 1);
                currentHashtags = tagsStr.split(/[\s,#]+/).map(t => t.trim()).filter(t => t.length > 0).map(t => t.startsWith('#') ? t : `#${t}`);
            } else if (trimmed.startsWith('#')) {
                const lineTags = trimmed.split(/[\s,#]+/).map(t => t.trim()).filter(t => t.length > 0).map(t => `#${t}`);
                currentHashtags.push(...lineTags);
            } else if (currentCaption && trimmed && !trimmed.toLowerCase().includes('suggestion')) {
                currentCaption += '\n' + trimmed;
            }
        }

        if (currentCaption) {
            suggestions.push({ caption: currentCaption, hashtags: currentHashtags.length > 0 ? currentHashtags : ['#socialmedia', '#viral'] });
        }

        if (suggestions.length === 0) {
            // Last resort
            suggestions.push({
                caption: text.substring(0, 300) + '...',
                hashtags: ['#socialmedia', '#contentcreation']
            });
        }
        return { suggestions };
    };

    return (
        <div style={{
            width: '360px', background: 'white', borderRadius: '14px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)', display: 'flex', flexDirection: 'column',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            flexShrink: 0, overflow: 'hidden', border: '1px solid #e5e7eb', height: '100%'
        }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdfdfd' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #818cf8, #c084fc)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Sparkle size={15} strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>AI Copywriter Assistant</span>
                </div>
                <div onClick={onClose} style={{ cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#f3f4f6' }}>
                    <X size={15} strokeWidth={2.5} />
                </div>
            </div>

            {/* Scrollable controls */}
            <div style={{ padding: '18px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* 1. API Key Config */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                            <Key size={13} /> GEMINI API CONFIG
                        </div>
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 600, background: useMock ? '#fee2e2' : '#dcfce7', color: useMock ? '#991b1b' : '#166534' }}>
                            {useMock ? 'Mocking Mode' : 'Connected'}
                        </span>
                    </div>

                    {isKeyEditing ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <input
                                type="password"
                                placeholder="Enter Gemini API Key..."
                                value={tempKey}
                                onChange={(e) => setTempKey(e.target.value)}
                                style={{ flex: 1, padding: '6px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
                            />
                            <button
                                onClick={handleSaveKey}
                                style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>••••••••••••{apiKey.slice(-4)}</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span
                                    onClick={() => setIsKeyEditing(true)}
                                    style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Change
                                </span>
                                <span
                                    onClick={() => {
                                        setApiKey('');
                                        setTempKey('');
                                        localStorage.removeItem('gemini_api_key');
                                        setUseMock(true);
                                        toast.success('API Key cleared. Switched to Mock mode.');
                                    }}
                                    style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Clear
                                </span>
                            </div>
                        </div>
                    )}

                    {useMock && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '8px', fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
                            <Info size={12} style={{ flexShrink: 0, color: '#ef4444', marginTop: '1px' }} />
                            <span>No API key set. Running in demo mock mode. Get a free Gemini API key from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Google AI Studio</a>.</span>
                        </div>
                    )}
                </div>

                {/* Photo Detection Banner */}
                {uploadedMedia.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '10px', padding: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, border: '1px solid #bae6fd' }}>
                            <img src={uploadedMedia[currentMediaIndex]?.url} alt="To analyze" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#0369a1' }}>PHOTO DETECTED</div>
                            <div style={{ fontSize: '10px', color: '#0284c7' }}>AI will scan the photo content for smart hashtags and context.</div>
                        </div>
                    </div>
                )}

                {/* 2. Platform optimization selector */}
                <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>TARGET PLATFORM</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                        {['Instagram', 'Facebook', 'LinkedIn', 'Twitter'].map(plat => (
                            <button
                                key={plat}
                                onClick={() => setPlatform(plat)}
                                style={{
                                    padding: '7px 4px', fontSize: '11px', fontWeight: 600,
                                    border: '1px solid',
                                    borderColor: platform === plat ? '#3b82f6' : '#e2e8f0',
                                    background: platform === plat ? '#eff6ff' : 'white',
                                    color: platform === plat ? '#2563eb' : '#475569',
                                    borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s'
                                }}
                            >
                                {plat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Tone Selector */}
                <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>STYLE & TONE</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        {['Exciting', 'Professional', 'Witty', 'Informative', 'Casual', 'Bold'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTone(t)}
                                style={{
                                    padding: '7px 4px', fontSize: '11px', fontWeight: 600,
                                    border: '1px solid',
                                    borderColor: tone === t ? '#818cf8' : '#e2e8f0',
                                    background: tone === t ? '#f5f3ff' : 'white',
                                    color: tone === t ? '#6d28d9' : '#475569',
                                    borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s'
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. Goal Selector */}
                <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>POST GOAL / CALL TO ACTION</label>
                    <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#1e293b', outline: 'none', background: 'white' }}
                    >
                        <option value="Drive Engagement">Drive Engagement (Likes/Comments)</option>
                        <option value="Increase Reach">Increase Reach / Visibility</option>
                        <option value="Promote Product/Service">Promote Product/Service</option>
                        <option value="Ask Question">Ask a Question / Spark debate</option>
                        <option value="Informational">Educational/Informational announcement</option>
                    </select>
                </div>

                {/* 5. Custom context / keywords */}
                <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>OPTIONAL KEYWORDS / TOPIC CONTEXT</label>
                    <textarea
                        placeholder="E.g. weekend sale, warm weather, organic snacks, discount code SUMMER20..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        style={{ width: '100%', height: '56px', padding: '8px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                    />
                </div>

                {/* 6. Hashtags count selector */}
                <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>HASHTAG QUANTITY</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                        {['None', '3-5', '5-10', '10+'].map(count => (
                            <button
                                key={count}
                                onClick={() => setHashtagsCount(count)}
                                style={{
                                    padding: '6px 4px', fontSize: '11px', fontWeight: 600,
                                    border: '1px solid',
                                    borderColor: hashtagsCount === count ? '#0284c7' : '#e2e8f0',
                                    background: hashtagsCount === count ? '#f0f9ff' : 'white',
                                    color: hashtagsCount === count ? '#0369a1' : '#475569',
                                    borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s'
                                }}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action button */}
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: isGenerating ? 'default' : 'pointer',
                        boxShadow: '0 4px 10px rgba(99, 102, 241, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginTop: '4px',
                        opacity: isGenerating ? 0.75 : 1
                    }}
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw size={14} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                            <span>Generating Copy Suggestions...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={14} />
                            <span>Generate Suggestions</span>
                        </>
                    )}
                </button>

                {/* CSS animation inline helper for spin */}
                <style>
                    {`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}
                </style>

                {/* Suggestions Output Area */}
                {suggestions.length > 0 && (
                    <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', borderTop: '1px solid #f3f4f6', paddingTop: '14px' }}>
                            ✨ GENERATED SUGGESTIONS
                        </div>

                        {suggestions.map((suggestion, idx) => {
                            const combinedText = `${suggestion.caption}\n\n${suggestion.hashtags.join(' ')}`;

                            return (
                                <div
                                    key={idx}
                                    style={{
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '10px',
                                        padding: '12px',
                                        background: '#fafafa',
                                        position: 'relative',
                                        transition: 'border-color 0.2s',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#818cf8' }}>OPTION {idx + 1}</span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleCopy(combinedText, idx)}
                                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '2px', padding: 0 }}
                                                title="Copy all"
                                            >
                                                {copiedIndex === idx ? <Check size={12} color="#22c55e" /> : <Copy size={12} />}
                                                <span style={{ fontSize: '10px' }}>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '12px', color: '#1e293b', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                                        {suggestion.caption}
                                    </div>

                                    {suggestion.hashtags.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', borderTop: '1px dashed #e2e8f0', paddingTop: '8px' }}>
                                            {suggestion.hashtags.map((tag, tagIdx) => (
                                                <span key={tagIdx} style={{ fontSize: '10px', fontWeight: 600, color: '#3b82f6', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                                        <button
                                            onClick={() => applySuggestion(suggestion.caption, '')}
                                            style={{
                                                padding: '6px 8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s'
                                            }}
                                        >
                                            Apply Caption
                                        </button>

                                        <button
                                            onClick={() => {
                                                const tagsStr = suggestion.hashtags.join(' ');
                                                if (showFirstComment) {
                                                    applySuggestion('', tagsStr);
                                                    toast.success('Applied hashtags to First Comment!');
                                                } else {
                                                    setShowFirstComment(true);
                                                    // Allow State render to commit
                                                    setTimeout(() => {
                                                        applySuggestion('', tagsStr);
                                                        toast.success('Opened & applied hashtags to First Comment!');
                                                    }, 50);
                                                }
                                            }}
                                            style={{
                                                padding: '6px 8px', background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s'
                                            }}
                                        >
                                            Apply Tags to 1st Comment
                                        </button>
                                    </div>

                                    <div style={{ display: 'block', textAlign: 'center', marginTop: '2px' }}>
                                        <button
                                            onClick={() => applySuggestion(suggestion.caption, suggestion.hashtags.join(' '))}
                                            style={{
                                                background: 'transparent', border: 'none', color: '#6366f1', fontSize: '10px', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: '2px 0'
                                            }}
                                        >
                                            Apply both to Caption editor
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIAssistantPanel;
