import { useState, useEffect, useRef } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function postToSocial({ platform, photoId, filename, caption, hashtags, isGenerated }) {
  const res = await fetch(`${API}/api/social/${platform}/post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photoId, filename, caption, hashtags, isGenerated }),
  });
  return res.json();
}

export default function PhotoStudio() {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(null);
  const [postResult, setPostResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  useEffect(() => { fetchPhotos(); }, []);

  async function fetchPhotos() {
    const res = await fetch(`${API}/api/photos`);
    const data = await res.json();
    if (data.success) setPhotos(data.photos);
  }

  async function handleUpload(files) {
    if (!files.length) return;
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('photos', f));
    const res = await fetch(`${API}/api/photos/upload`, { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      setPhotos(prev => [...data.photos, ...prev]);
      setSelected(data.photos[0]);
    }
    setUploading(false);
  }

  async function handleAnalyze(photo) {
    setAnalyzing(true);
    const res = await fetch(`${API}/api/photos/${photo.id}/analyze`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      setPhotos(prev => prev.map(p => p.id === photo.id ? data.photo : p));
      setSelected(data.photo);
    }
    setAnalyzing(false);
  }

  async function handlePost(platform, photo, genFilename = null) {
    setPosting(platform + (genFilename || ''));
    setPostResult(null);
    const result = await postToSocial({
      platform,
      photoId: photo.id,
      filename: genFilename || photo.filename,
      caption: photo.aiAnalysis?.caption || '',
      hashtags: photo.aiAnalysis?.hashtags || [],
      isGenerated: !!genFilename,
    });
    setPostResult(result);
    setPosting(null);
    if (result.success) fetchPhotos();
  }

  async function handleGenerate(photo) {
    setGenerating(true);
    const res = await fetch(`${API}/api/photos/${photo.id}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: 2 }),
    });
    const data = await res.json();
    if (data.success) {
      const updated = await fetch(`${API}/api/photos/${photo.id}`).then(r => r.json());
      setPhotos(prev => prev.map(p => p.id === photo.id ? updated.photo : p));
      setSelected(updated.photo);
    }
    setGenerating(false);
  }

  const thumbUrl = (p) => `${API}/api/photos/file/${p.thumbFilename}`;
  const fullUrl = (p) => `${API}/api/photos/file/${p.filename}`;
  const genUrl = (f) => `${API}/api/photos/generated/${f}`;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 46px)', fontFamily: 'system-ui, sans-serif' }}>

      {/* Left panel — gallery */}
      <div style={{
        width: 280, borderRight: '0.5px solid #e5e7eb',
        overflowY: 'auto', background: '#fafafa', flexShrink: 0,
      }}>
        {/* Upload zone */}
        <div
          onClick={() => fileRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
          style={{
            margin: 12, padding: 20,
            border: `2px dashed ${dragOver ? '#7F77DD' : '#d1d5db'}`,
            borderRadius: 10, textAlign: 'center', cursor: 'pointer',
            background: dragOver ? '#EEEDFE' : '#fff',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ fontSize: 28 }}>📸</div>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
            {uploading ? 'Uploading...' : 'Drop photos here or click to upload'}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#9ca3af' }}>JPG, PNG, WEBP up to 20MB</p>
          <input
            ref={fileRef} type="file" multiple accept="image/*"
            style={{ display: 'none' }}
            onChange={e => handleUpload(e.target.files)}
          />
        </div>

        {/* Photo grid */}
        <div style={{ padding: '0 12px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {photos.map(photo => (
            <div
              key={photo.id}
              onClick={() => setSelected(photo)}
              style={{
                borderRadius: 8, overflow: 'hidden', cursor: 'pointer', aspectRatio: '1',
                border: selected?.id === photo.id ? '2.5px solid #7F77DD' : '2px solid transparent',
                position: 'relative',
              }}
            >
              <img src={thumbUrl(photo)} alt={photo.originalName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {photo.aiAnalysis && (
                <div style={{
                  position: 'absolute', top: 4, right: 4,
                  background: '#7F77DD', borderRadius: 4,
                  padding: '1px 5px', fontSize: 10, color: '#fff',
                }}>✦ AI</div>
              )}
            </div>
          ))}
        </div>

        {photos.length === 0 && !uploading && (
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, padding: 20 }}>
            No photos yet. Upload your first one!
          </p>
        )}
      </div>

      {/* Right panel — detail */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {!selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
            <div style={{ fontSize: 48 }}>✦</div>
            <p style={{ marginTop: 12, fontSize: 15 }}>Select a photo to analyze and generate content</p>
          </div>
        ) : (
          <div style={{ maxWidth: 680 }}>

            {/* Photo + actions */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
              <img src={fullUrl(selected)} alt={selected.originalName}
                style={{ width: 260, height: 260, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }} />

              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 15 }}>{selected.originalName}</p>
                <p style={{ margin: '0 0 16px', fontSize: 12, color: '#9ca3af' }}>
                  Uploaded {new Date(selected.uploadedAt).toLocaleDateString()}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    onClick={() => handleAnalyze(selected)}
                    disabled={analyzing}
                    style={{
                      padding: '10px 16px', borderRadius: 8, border: 'none',
                      background: '#7F77DD', color: '#fff', cursor: analyzing ? 'not-allowed' : 'pointer',
                      fontWeight: 600, fontSize: 13, opacity: analyzing ? 0.7 : 1,
                    }}
                  >
                    {analyzing ? '✦ Claude is analyzing...' : '✦ Analyze with Claude AI'}
                  </button>

                  <button
                    onClick={() => handleGenerate(selected)}
                    disabled={generating || !selected.aiAnalysis}
                    style={{
                      padding: '10px 16px', borderRadius: 8,
                      border: '1.5px solid #7F77DD', background: '#EEEDFE',
                      color: '#7F77DD', cursor: (generating || !selected.aiAnalysis) ? 'not-allowed' : 'pointer',
                      fontWeight: 600, fontSize: 13, opacity: (generating || !selected.aiAnalysis) ? 0.6 : 1,
                    }}
                  >
                    {generating ? 'Generating images...' : '🎨 Generate AI Variations (DALL-E)'}
                  </button>

                  {!selected.aiAnalysis && (
                    <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
                      Analyze first to enable AI generation
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Claude analysis results */}
            {selected.aiAnalysis && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ margin: '0 0 12px', fontWeight: 600, fontSize: 14 }}>✦ Claude Analysis</p>

                <div style={{ background: '#f9fafb', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Service detected</p>
                  <p style={{ margin: 0, fontSize: 14 }}>{selected.aiAnalysis.service}</p>
                </div>

                <div style={{ background: '#f9fafb', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Instagram caption</p>
                  <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.6 }}>{selected.aiAnalysis.caption}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {selected.aiAnalysis.hashtags?.map(h => (
                      <span key={h} style={{ background: '#EEEDFE', color: '#7F77DD', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>{h}</span>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#f9fafb', borderRadius: 10, padding: 16 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>TikTok hook</p>
                  <p style={{ margin: 0, fontSize: 14, fontStyle: 'italic' }}>"{selected.aiAnalysis.tiktokHook}"</p>
                </div>

                {/* Post buttons for original photo */}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button
                    onClick={() => handlePost('instagram', selected)}
                    disabled={!!posting}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                      background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                      color: '#fff', fontWeight: 600, fontSize: 13,
                      cursor: posting ? 'not-allowed' : 'pointer', opacity: posting ? 0.7 : 1,
                    }}
                  >
                    {posting === 'instagram' ? 'Posting...' : '📸 Post to Instagram'}
                  </button>
                  <button
                    onClick={() => handlePost('tiktok', selected)}
                    disabled={!!posting}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                      background: '#010101', color: '#fff', fontWeight: 600, fontSize: 13,
                      cursor: posting ? 'not-allowed' : 'pointer', opacity: posting ? 0.7 : 1,
                    }}
                  >
                    {posting === 'tiktok' ? 'Posting...' : '🎵 Post to TikTok'}
                  </button>
                </div>

                {postResult && (
                  <div style={{
                    marginTop: 10, padding: '10px 14px', borderRadius: 8,
                    background: postResult.success ? '#E1F5EE' : '#FEF0EE',
                    color: postResult.success ? '#1D9E75' : '#D85A30', fontSize: 13,
                  }}>
                    {postResult.success
                      ? `✓ Posted! View at ${postResult.url}`
                      : `Error: ${postResult.error}`}
                  </div>
                )}
              </div>
            )}

            {/* Generated images */}
            {selected.generatedImages?.length > 0 && (
              <div>
                <p style={{ margin: '0 0 12px', fontWeight: 600, fontSize: 14 }}>🎨 AI Generated Variations</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                  {selected.generatedImages.map((g, i) => (
                    <div key={i} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                      <img src={genUrl(g.filename)} alt={`Generated ${i + 1}`}
                        style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                      <div style={{ padding: '8px 10px', background: '#fafafa' }}>
                        <p style={{ margin: '0 0 4px', fontSize: 11, color: '#6b7280' }}>
                          Generated {new Date(g.createdAt).toLocaleDateString()}
                        </p>
                        <button
                          onClick={() => handlePost('instagram', selected, g.filename)}
                          disabled={!!posting}
                          style={{
                            width: '100%', padding: '6px 0', border: 'none',
                            background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                            color: '#fff', borderRadius: 5, fontSize: 11,
                            cursor: posting ? 'not-allowed' : 'pointer', fontWeight: 600,
                          }}
                        >
                          {posting === ('instagram' + g.filename) ? 'Posting...' : '📸 Instagram'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
