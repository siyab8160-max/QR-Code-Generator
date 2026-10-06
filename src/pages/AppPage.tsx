import React, { useState, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { LogOut, Copy, Download, RefreshCw, Settings, ChevronDown, ChevronUp, Link as LinkIcon, Check } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const AppPage: React.FC = () => {
  const { signOut, user } = useAuth();
  const [url, setUrl] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Customization state
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [showCustomization, setShowCustomization] = useState(false);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const validateAndNormalizeUrl = (input: string) => {
    let normalized = input.trim();
    if (!normalized) throw new Error("URL cannot be empty.");
    
    if (normalized.length > 2000) {
      throw new Error("URL is too long.");
    }
    
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = 'https://' + normalized;
    }
    
    try {
      new URL(normalized);
    } catch (e) {
      throw new Error("Please enter a valid URL.");
    }
    
    return normalized;
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const validUrl = validateAndNormalizeUrl(url);
      setIsGenerating(true);
      
      // Artificial short delay for "premium" feel and to prevent double clicks
      setTimeout(() => {
        setGeneratedUrl(validUrl);
        setIsGenerating(false);
      }, 400);
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateAnother = () => {
    setGeneratedUrl('');
    setUrl('');
    setError('');
  };

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qrcode.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const downloadSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    let downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "qrcode.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  const copyUrl = async () => {
    if (generatedUrl) {
      try {
        await navigator.clipboard.writeText(generatedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-logo">
          <LinkIcon size={24} />
          <span>QRLnk</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted hidden md:inline-block">
            {typeof user === 'object' && user?.email ? user.email : ''}
          </span>
          <button onClick={signOut} className="btn btn-ghost" title="Log out">
            <LogOut size={18} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      <main className="main-content" style={{ padding: '2rem 1rem' }}>
        <div className="app-layout">
          
          {/* Input Panel */}
          <div className="panel">
            <h2 className="mb-6">Create QR Code</h2>
            
            <form onSubmit={handleGenerate} className="flex-col" style={{ flex: 1, display: 'flex' }}>
              <div className="form-group mb-6">
                <label className="form-label mb-2" htmlFor="url">Destination URL</label>
                <input 
                  id="url"
                  type="text" 
                  className={`form-input ${error ? 'error' : ''}`}
                  placeholder="e.g. yourwebsite.com or https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={!!generatedUrl || isGenerating}
                />
                {error && <span className="error-message mt-1">{error}</span>}
              </div>

              {!generatedUrl && (
                <div className="mt-auto">
                  <div style={{ borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }}></div>
                  
                  <button 
                    type="button" 
                    className="accordion-header"
                    onClick={() => setShowCustomization(!showCustomization)}
                  >
                    <span className="flex items-center gap-2">
                      <Settings size={18} />
                      Customize
                    </span>
                    {showCustomization ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  
                  <div className={`accordion-content ${showCustomization ? 'open' : ''}`}>
                    <div className="pt-2 pb-4">
                      <div className="grid gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                        <div className="form-group mb-0">
                          <label className="form-label">Foreground</label>
                          <div className="color-picker-group">
                            <input 
                              type="color" 
                              value={fgColor} 
                              onChange={(e) => setFgColor(e.target.value)} 
                              className="color-input"
                            />
                            <span className="text-sm font-mono text-muted">{fgColor.toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="form-group mb-0">
                          <label className="form-label">Background</label>
                          <div className="color-picker-group">
                            <input 
                              type="color" 
                              value={bgColor} 
                              onChange={(e) => setBgColor(e.target.value)} 
                              className="color-input"
                            />
                            <span className="text-sm font-mono text-muted">{bgColor.toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="form-group mb-0" style={{ gridColumn: '1 / -1' }}>
                          <label className="form-label">Error Correction</label>
                          <select 
                            className="form-input" 
                            value={errorLevel} 
                            onChange={(e) => setErrorLevel(e.target.value as any)}
                          >
                            <option value="L">Low (7%) - Best for simple URLs</option>
                            <option value="M">Medium (15%) - Standard</option>
                            <option value="Q">Quartile (25%) - Good for customization</option>
                            <option value="H">High (30%) - Best for logos</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-full mt-4" 
                    style={{ padding: '0.875rem' }}
                    disabled={isGenerating || !url.trim()}
                  >
                    {isGenerating ? 'Generating...' : 'Generate QR Code'}
                  </button>
                </div>
              )}

              {generatedUrl && (
                <div className="mt-auto">
                  <button 
                    type="button" 
                    className="btn btn-outline w-full"
                    onClick={handleCreateAnother}
                    style={{ padding: '0.875rem' }}
                  >
                    <RefreshCw size={18} />
                    Create Another
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Preview Panel */}
          <div className="panel" style={{ backgroundColor: generatedUrl ? 'var(--color-bg)' : 'var(--color-surface)', borderColor: generatedUrl ? 'var(--color-border)' : 'transparent' }}>
            <h2 className="mb-6">{generatedUrl ? 'Your QR Code' : 'Preview'}</h2>
            
            {generatedUrl ? (
              <div className="flex flex-col items-center">
                <div className="qr-container">
                  {/* Render both Canvas (for PNG download) and SVG (for display and SVG download) */}
                  <div style={{ display: 'none' }}>
                    <QRCodeCanvas 
                      id="qr-canvas"
                      value={generatedUrl} 
                      size={1024} 
                      level={errorLevel}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      includeMargin={true}
                      ref={canvasRef}
                    />
                  </div>
                  <QRCodeSVG 
                    id="qr-svg"
                    value={generatedUrl} 
                    size={240} 
                    level={errorLevel}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    includeMargin={true}
                    ref={svgRef}
                  />
                </div>
                
                <p className="text-sm font-mono text-muted mb-6 w-full text-center" style={{ overflowWrap: 'anywhere' }}>
                  {generatedUrl}
                </p>
                
                <div className="w-full flex flex-col gap-3">
                  <div className="flex gap-3 w-full">
                    <button className="btn btn-primary flex-1" onClick={downloadPNG}>
                      <Download size={18} />
                      PNG
                    </button>
                    <button className="btn btn-outline flex-1" onClick={downloadSVG}>
                      <Download size={18} />
                      SVG
                    </button>
                  </div>
                  <button className="btn btn-outline w-full" onClick={copyUrl}>
                    {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
                    {copied ? 'Copied!' : 'Copy URL'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="qr-preview text-muted text-center h-full">
                <QrPlaceholder />
                <p className="mt-4">Enter a URL to generate</p>
              </div>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
};

const QrPlaceholder = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="30" height="30" rx="4" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
    <rect x="80" y="10" width="30" height="30" rx="4" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
    <rect x="10" y="80" width="30" height="30" rx="4" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
    <rect x="50" y="50" width="20" height="20" rx="2" fill="currentColor" opacity="0.2" />
    <rect x="80" y="80" width="10" height="10" rx="1" fill="currentColor" opacity="0.2" />
    <rect x="100" y="80" width="10" height="10" rx="1" fill="currentColor" opacity="0.2" />
    <rect x="80" y="100" width="10" height="10" rx="1" fill="currentColor" opacity="0.2" />
  </svg>
);
