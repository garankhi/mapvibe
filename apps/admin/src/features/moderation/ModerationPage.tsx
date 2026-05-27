import { useEffect, useMemo, useState } from 'react';
import {
  type CandidateFilter,
  type ModerationCandidate,
  type CandidateStatus,
  loadPendingCandidates,
} from './mockModerationAdapter';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function matchesQuery(candidate: ModerationCandidate, query: string) {
  if (!query) {
    return true;
  }

  const normalized = query.toLowerCase();
  return [candidate.title, candidate.summary, candidate.source, candidate.reason]
    .join(' ')
    .toLowerCase()
    .includes(normalized);
}

export default function ModerationPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CandidateFilter>('all');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [simulateError, setSimulateError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [candidates, setCandidates] = useState<ModerationCandidate[]>([]);
  const [selected, setSelected] = useState<ModerationCandidate | null>(null);

  useEffect(() => {
    let isCancelled = false;

    setLoading(true);
    setError('');

    loadPendingCandidates(simulateError)
      .then((items) => {
        if (!isCancelled) {
          setCandidates(items);
        }
      })
      .catch((loadError: unknown) => {
        if (!isCancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load moderation queue.');
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [reloadToken, simulateError]);

  const visibleCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const typeMatches = filter === 'all' || candidate.type === filter;
      const statusMatches = statusFilter === 'all' || candidate.status === statusFilter;
      return typeMatches && statusMatches && matchesQuery(candidate, search);
    });
  }, [candidates, filter, search, statusFilter]);

  const handleDecision = (candidateId: string, newStatus: CandidateStatus) => {
    setCandidates((current) => current.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c)));
  };

  const totalCount = candidates.length;
  const pendingCount = candidates.filter((c) => c.status === 'pending').length;
  const approvedCount = candidates.filter((c) => c.status === 'approved').length;

  return (
    <section className="moderation-page">
      <header className="main-header moderation-header">
        <div>
          <h2 className="page-title">Moderation</h2>
          <p className="page-subtitle">Review pending candidates without waiting for backend data.</p>
        </div>
        <div className="moderation-meta">
          <span className="queue-pill">{visibleCandidates.length} pending</span>
          <button type="button" className="secondary-btn" onClick={() => setReloadToken((value) => value + 1)}>
            Refresh
          </button>
          <button
            type="button"
            className={`secondary-btn ${simulateError ? 'secondary-btn-active' : ''}`}
            onClick={() => setSimulateError((value) => !value)}
          >
            {simulateError ? 'Error mode on' : 'Simulate error'}
          </button>
        </div>
      </header>

      <div className="moderation-summary">
        <div className="summary-card card">
          <div className="summary-label">Total</div>
          <div className="summary-value">{totalCount}</div>
        </div>
        <div className="summary-card card">
          <div className="summary-label">Pending</div>
          <div className="summary-value">{pendingCount}</div>
        </div>
        <div className="summary-card card">
          <div className="summary-label">Approved</div>
          <div className="summary-value">{approvedCount}</div>
        </div>
      </div>

      <div className="moderation-toolbar card">
        <label className="field">
          <span className="field-label">Search</span>
          <input
            className="control-input"
            type="search"
            placeholder="Search by title, source, or reason"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label className="field">
          <span className="field-label">Filter</span>
          <select className="control-input" value={filter} onChange={(event) => setFilter(event.target.value as CandidateFilter)}>
            <option value="all">All pending</option>
            <option value="place">Places</option>
            <option value="review">Reviews</option>
            <option value="user">Users</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">Status</span>
          <select className="control-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as CandidateStatus | 'all')}>
            <option value="pending">Pending</option>
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>

        {/* Sort removed per request */}
      </div>

      {loading ? (
        <div className="state-card card" role="status" aria-live="polite">
          <div className="state-title">Loading moderation queue</div>
          <div className="state-copy">Fetching mock candidates so the page works before backend integration.</div>
        </div>
      ) : error ? (
        <div className="state-card card state-error" role="alert">
          <div className="state-title">Something went wrong</div>
          <div className="state-copy">{error}</div>
          <button type="button" className="primary-btn" onClick={() => setReloadToken((value) => value + 1)}>
            Retry
          </button>
        </div>
      ) : visibleCandidates.length === 0 ? (
        <div className="state-card card">
          <div className="state-title">No pending candidates</div>
          <div className="state-copy">Try another search term or clear the selected filter.</div>
        </div>
      ) : (
        <div className="card moderation-table-card">
          <div className="moderation-table-header">
            <h3 className="card-title">Pending Candidates</h3>
            <span className="moderation-count">{visibleCandidates.length} items</span>
          </div>

          <div className="moderation-table-scroll">
            <table className="moderation-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Submitted</th>
                  <th>Submitted By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <div className="candidate-cell">
                        <div className="candidate-title">{candidate.title}</div>
                        <div className="candidate-subtitle">{candidate.source}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`type-pill type-${candidate.type}`}>{candidate.type}</span>
                    </td>
                    <td>{formatDate(candidate.createdAt)}</td>
                    <td>
                      <div className="candidate-submitter">{candidate.submittedBy?.username ?? '—'}</div>
                    </td>
                    <td>
                      <div className={`status-pill status-${candidate.status}`}>{candidate.status}</div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button type="button" className="approve-btn" onClick={() => handleDecision(candidate.id, 'approved')}>
                          Approve
                        </button>
                        <button type="button" className="reject-btn" onClick={() => handleDecision(candidate.id, 'rejected')}>
                          Reject
                        </button>
                        <button type="button" className="secondary-btn" onClick={() => setSelected(candidate)}>
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card card">
            <div className="modal-header">
              <h3 className="card-title">{selected.title}</h3>
              <button className="secondary-btn" onClick={() => setSelected(null)}>Close</button>
            </div>
            <div className="modal-body modal-grid">
              <div className="modal-left">
                <div className="modal-row">
                  <strong>Type:</strong> {selected.type}
                </div>
                <div className="modal-row">
                  <strong>Submitted by:</strong> {selected.submittedBy?.username}
                </div>
                <div className="modal-row">
                  <strong>Submitted:</strong> {formatDate(selected.createdAt)}
                </div>
                <div className="modal-row">
                  <strong>Summary:</strong>
                  <div className="candidate-reason">{selected.summary}</div>
                </div>

                {selected.type === 'place' && selected.payload && 'name' in selected.payload && (
                  <div className="detail-section place-details">
                    <h4 className="detail-title">Place details</h4>
                    <div className="detail-row"><strong>Name:</strong> {(selected.payload as any).name}</div>
                    <div className="detail-row"><strong>Address:</strong> {(selected.payload as any).address}</div>
                    <div className="detail-row"><strong>Phone:</strong> {(selected.payload as any).phone ?? '—'}</div>
                    <div className="detail-row"><strong>Description:</strong> {(selected.payload as any).description}</div>
                    <div className="detail-row"><strong>Amenities:</strong>
                      <div className="amenities-list">
                        {Object.entries((selected.payload as any).amenities)
                          .filter(([, v]) => !!v)
                          .map(([k]) => (
                            <span key={k} className={`amenity-pill`}>{k}</span>
                          ))}
                      </div>
                    </div>
                    {(selected.payload as any).posterReview && (
                      <div className="poster-review">
                        <h5 className="detail-subtitle">Poster review</h5>
                        <div className="rating-stars">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`star ${i < (selected.payload as any).posterReview.rating ? 'filled' : ''}`}>★</span>
                          ))}
                        </div>
                        <div className="candidate-reason">{(selected.payload as any).posterReview.text}</div>
                      </div>
                    )}
                  </div>
                )}

                {selected.type === 'review' && selected.payload && 'rating' in selected.payload && (
                  <div className="detail-section review-details">
                    <h4 className="detail-title">Review details</h4>
                    <div className="detail-row"><strong>Rating:</strong>
                      <div className="rating-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`star ${i < (selected.payload as any).rating ? 'filled' : ''}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <div className="detail-row"><strong>Feedback:</strong>
                      <div className="candidate-reason">{(selected.payload as any).feedback}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-right">
                {/* Images and media */}
                {selected.type === 'place' && selected.payload && 'images' in (selected.payload as any) && (
                  <div className="image-galleries">
                    <div className="gallery">
                      <div className="gallery-title">Menu</div>
                      <div className="images-row">
                        {((selected.payload as any).images.menu || []).map((src: string, i: number) => (
                          <img key={`m${i}`} src={src} alt={`menu-${i}`} />
                        ))}
                      </div>
                    </div>
                    <div className="gallery">
                      <div className="gallery-title">Space</div>
                      <div className="images-row">
                        {((selected.payload as any).images.space || []).map((src: string, i: number) => (
                          <img key={`s${i}`} src={src} alt={`space-${i}`} />
                        ))}
                      </div>
                    </div>
                    <div className="gallery">
                      <div className="gallery-title">Dishes</div>
                      <div className="images-row">
                        {((selected.payload as any).images.dishes || []).map((src: string, i: number) => (
                          <img key={`d${i}`} src={src} alt={`dish-${i}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selected.type === 'review' && selected.payload && 'images' in (selected.payload as any) && (
                  <div className="gallery">
                    <div className="gallery-title">Review images</div>
                    <div className="images-row">
                      {((selected.payload as any).images || []).map((src: string, i: number) => (
                        <img key={`r${i}`} src={src} alt={`review-${i}`} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="approve-btn" onClick={() => { handleDecision(selected.id, 'approved'); setSelected(null); }}>Approve</button>
              <button className="reject-btn" onClick={() => { handleDecision(selected.id, 'rejected'); setSelected(null); }}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}