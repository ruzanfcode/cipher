import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const sbuList = [
  { id: 'americas', name: 'Americas', admin: 'Alex Chen', status: 'Active', users: 24, quota: 40, analyses: 156, analysesMonth: 38, collections: 18, reviews: 48200, brands: ['Nike', 'Champion', 'Under Armour'], markets: ['US', 'Canada', 'Brazil'], dataHealth: 94, pendingInvites: 3, lastSync: '21 Jul 2026, 09:30', description: 'North and South America market teams for brand and product intelligence.' },
  { id: 'apac', name: 'APAC', admin: 'Priya Patel', status: 'Active', users: 31, quota: 50, analyses: 203, analysesMonth: 52, collections: 24, reviews: 73100, brands: ['Uniqlo', 'Nike', 'Lululemon'], markets: ['India', 'China', 'Japan'], dataHealth: 91, pendingInvites: 5, lastSync: '21 Jul 2026, 08:10', description: 'Asia-Pacific teams covering regional competitor and customer sentiment signals.' },
  { id: 'emea', name: 'EMEA', admin: "James O'Brien", status: 'Active', users: 19, quota: 35, analyses: 142, analysesMonth: 29, collections: 15, reviews: 38900, brands: ['H&M', 'Zara', 'Adidas'], markets: ['UK', 'Germany', 'UAE'], dataHealth: 88, pendingInvites: 2, lastSync: '20 Jul 2026, 17:45', description: 'Europe, Middle East, and Africa workspace for seasonal research programs.' },
  { id: 'global-brands', name: 'Global Brands', admin: 'Unassigned', status: 'Inactive', users: 8, quota: 20, analyses: 67, analysesMonth: 7, collections: 9, reviews: 21100, brands: ['Nike', 'Adidas', 'Gymshark'], markets: ['Global'], dataHealth: 76, pendingInvites: 0, lastSync: '14 Jul 2026, 11:00', description: 'Central brand benchmarking and global reporting workspace.' },
];

const members = [
  { id: 'maya', name: 'Maya Chen', email: 'maya.chen@mas.com', role: 'SBU admin', active: true },
  { id: 'priya', name: 'Priya Nair', email: 'priya.nair@studio.com', role: 'User', active: true },
  { id: 'sofia', name: 'Sofia Bianchi', email: 'sofia.bianchi@studio.com', role: 'User', active: true },
  { id: 'liam', name: 'Liam Ortega', email: 'liam.ortega@studio.com', role: 'User', active: false },
];

const pendingInvitations = [
  { id: 'inv-americas-1', sbuId: 'americas', email: 'elena.rivera@mas.com', role: 'User', invitedBy: 'Alex Chen', sent: '20 Jul 2026' },
  { id: 'inv-americas-2', sbuId: 'americas', email: 'marcus.lee@mas.com', role: 'SBU admin', invitedBy: 'Alex Chen', sent: '19 Jul 2026' },
  { id: 'inv-apac-1', sbuId: 'apac', email: 'anika.rao@mas.com', role: 'User', invitedBy: 'Priya Patel', sent: '21 Jul 2026' },
  { id: 'inv-apac-2', sbuId: 'apac', email: 'kenji.sato@mas.com', role: 'User', invitedBy: 'Priya Patel', sent: '18 Jul 2026' },
  { id: 'inv-emea-1', sbuId: 'emea', email: 'nora.haddad@mas.com', role: 'User', invitedBy: "James O'Brien", sent: '17 Jul 2026' },
];

function initials(name) {
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function SbuModal({ title, subtitle, actionLabel, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [admin, setAdmin] = useState('');
  const [message, setMessage] = useState(null);

  function submit() {
    if (!name.trim() || !admin.trim()) {
      setMessage({ type: 'error', text: 'SBU name and admin are required.' });
      return;
    }
    onSuccess(`${name.trim()} has been created.`);
    onClose();
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-panel sbu-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-title"><h3>{title}</h3><button type="button" onClick={onClose} aria-label="Close">×</button></div>
        <p className="modal-subtitle">{subtitle}</p>
        <div className="sbu-form-grid">
          <label><span>SBU name</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Performance Asia" /></label>
          <label><span>Admin</span><input value={admin} onChange={(event) => setAdmin(event.target.value)} placeholder="name@mas.com" /></label>
          <label><span>User quota</span><input type="number" placeholder="40" /></label>
          <label><span>Status</span><select defaultValue="Active"><option>Active</option><option>Inactive</option></select></label>
        </div>
        {message ? <div className={`sbu-form-message sbu-form-message--${message.type}`}>{message.text}</div> : null}
        <div className="confirm-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="button" onClick={submit}>{actionLabel}</button></div>
      </div>
    </div>
  );
}

function InviteModal({ sbu, onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  function submit() {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setMessage({ type: 'error', text: 'Enter a valid email address.' });
      return;
    }
    onSuccess(`Invitation sent to ${email.trim()}.`);
    onClose();
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-panel sbu-modal" role="dialog" aria-modal="true" aria-label="Invite user">
        <div className="modal-title"><h3>Invite user</h3><button type="button" onClick={onClose} aria-label="Close">×</button></div>
        <p className="modal-subtitle">Invite a teammate to {sbu.name} and assign their access level.</p>
        <div className="sbu-form-grid sbu-form-grid--invite">
          <label><span>Email address</span><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="teammate@mas.com" /></label>
          <label><span>Role</span><select defaultValue="User"><option>SBU admin</option><option>User</option></select></label>
        </div>
        {message ? <div className={`sbu-form-message sbu-form-message--${message.type}`}>{message.text}</div> : null}
        <div className="confirm-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="button" onClick={submit}>Send invite</button></div>
      </div>
    </div>
  );
}

function SbuToast({ toast, onClose }) {
  if (!toast) return null;
  return <div className={`sbu-toast sbu-toast--${toast.type}`} role="status"><span>{toast.text}</span><button type="button" onClick={onClose} aria-label="Dismiss message">×</button></div>;
}

function ActionConfirmModal({ action, onClose }) {
  if (!action) return null;
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-panel confirm-panel" role="dialog" aria-modal="true" aria-label={action.title}>
        <h3 className="confirm-title">{action.title}</h3>
        <p className="confirm-message">{action.message}</p>
        <div className="confirm-actions">
          <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
          <button className={action.danger ? 'danger-button' : 'primary-button'} type="button" onClick={() => { action.onConfirm(); onClose(); }}>{action.confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function SbuCard({ sbu, onOpen }) {
  const used = Math.round((sbu.users / sbu.quota) * 100);
  return (
    <button className="sbu-card" type="button" onClick={onOpen}>
      <div className="sbu-card__head">
        <span><b>{sbu.name}</b><small>{sbu.description}</small></span>
        <i className={`sbu-status sbu-status--${sbu.status.toLowerCase()}`}>{sbu.status}</i>
        <span className="sbu-arrow">›</span>
      </div>
      <div className="sbu-card__meta"><span>Admin: {sbu.admin}</span><span>{sbu.markets.join(' / ')}</span></div>
      <div className="sbu-metrics">
        <span><b>{sbu.users}/{sbu.quota}</b><small>Users</small></span>
        <span><b>{sbu.analyses}</b><small>Analysis completed</small></span>
        <span><b>{sbu.collections}</b><small>Collections saved</small></span>
      </div>
      <div className="sbu-quota"><div><b>User quota</b><strong>{sbu.users}/{sbu.quota}</strong></div><span><i style={{ width: `${used}%` }} /></span><small>{sbu.users} used <em>{sbu.quota - sbu.users} free</em></small></div>
    </button>
  );
}

function UserManagementPage({ app: _app }) {
  const navigate = useNavigate();
  const { sbuId } = useParams();
  const sbu = sbuList.find((item) => item.id === sbuId);
  const [createOpen, setCreateOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [memberRows, setMemberRows] = useState(members);
  const [invitationRows, setInvitationRows] = useState(pendingInvitations);
  const [confirmation, setConfirmation] = useState(null);
  const [toast, setToast] = useState(null);

  function requestConfirmation(action) {
    setConfirmation(action);
  }

  if (sbuId && !sbu) return <main className="page wide-page fade-page"><button className="text-back" type="button" onClick={() => navigate('/admin/users')}>← SBU management</button><div className="page-intro"><h1>SBU not found</h1><p>Select an existing strategic business unit.</p></div></main>;

  if (sbu) {
    const used = Math.round((sbu.users / sbu.quota) * 100);
    const sbuInvitations = invitationRows.filter((invite) => invite.sbuId === sbu.id);
    return (
      <main className="page wide-page fade-page sbu-page">
        <button className="text-back" type="button" onClick={() => navigate('/admin/users')}>← SBU management</button>
        <div className="sbu-detail-head">
          <div><h1>{sbu.name}</h1><p>{sbu.description}</p></div>
          <button className="primary-button" type="button" onClick={() => setInviteOpen(true)}>Invite user</button>
        </div>
        <section className="sbu-detail-grid">
          <article className="sbu-detail-card"><span>Users</span><strong>{sbu.users}/{sbu.quota}</strong><p>{sbu.quota - sbu.users} seats available</p></article>
          <article className="sbu-detail-card"><span>Analysis completed</span><strong>{sbu.analyses}</strong><p>Across active workspaces</p></article>
          <article className="sbu-detail-card"><span>Collections saved</span><strong>{sbu.collections}</strong><p>Shared research boards</p></article>
        </section>
        <section className="sbu-detail-panel">
          <div className="sbu-detail-stack">
            <div className="sbu-quota sbu-quota--detail"><div><b>User quota</b><strong>{sbu.users}/{sbu.quota}</strong></div><span><i style={{ width: `${used}%` }} /></span><small>{sbu.users} used <em>{sbu.quota - sbu.users} free</em></small></div>
            <div className="sbu-info-list"><h2>Workspace information</h2><p><span>Admin</span><b>{sbu.admin}</b></p><p><span>Status</span><b>{sbu.status}</b></p><p><span>Pending invites</span><b>{sbuInvitations.length}</b></p><p><span>Last data sync</span><b>{sbu.lastSync}</b></p></div>
          </div>
          <div className="sbu-member-list"><h2>Members</h2>{memberRows.map((member) => <div key={member.email}><span className="avatar avatar--dark">{initials(member.name)}</span><span><b>{member.name}</b><small>{member.email}</small></span><span className="sbu-member-meta"><strong>{member.role}</strong><i className={`sbu-user-state ${member.active ? 'sbu-user-state--active' : 'sbu-user-state--inactive'}`}>{member.active ? 'Active' : 'Inactive'}</i></span><span className="sbu-row-actions"><button type="button" onClick={() => requestConfirmation({ title: `${member.active ? 'Deactivate' : 'Activate'} user?`, message: `${member.name} will be ${member.active ? 'marked inactive and lose access until reactivated' : 'marked active and regain access'} in ${sbu.name}.`, confirmLabel: member.active ? 'Deactivate' : 'Activate', danger: member.active, onConfirm: () => setMemberRows((current) => current.map((item) => item.id === member.id ? { ...item, active: !item.active } : item)) })}>{member.active ? 'Deactivate' : 'Activate'}</button><button className="danger-link" type="button" onClick={() => requestConfirmation({ title: 'Delete user?', message: `${member.name} will be removed from ${sbu.name}.`, confirmLabel: 'Delete', danger: true, onConfirm: () => setMemberRows((current) => current.filter((item) => item.id !== member.id)) })}>Delete</button></span></div>)}</div>
        </section>
        <section className="sbu-invite-list">
          <div><h2>Pending invitations</h2><span>{sbuInvitations.length} pending</span></div>
          {sbuInvitations.length ? sbuInvitations.map((invite) => <article key={invite.id}><span><b>{invite.email}</b><small>{invite.role} · Invited by {invite.invitedBy} · {invite.sent}</small></span><button type="button" onClick={() => requestConfirmation({ title: 'Reject invitation?', message: `The pending invitation for ${invite.email} will be removed.`, confirmLabel: 'Reject', danger: true, onConfirm: () => setInvitationRows((current) => current.filter((item) => item.id !== invite.id)) })}>Reject</button></article>) : <p>No pending invitations for this SBU.</p>}
        </section>
        {inviteOpen ? <InviteModal sbu={sbu} onClose={() => setInviteOpen(false)} onSuccess={(text) => setToast({ type: 'success', text })} /> : null}
        <ActionConfirmModal action={confirmation} onClose={() => setConfirmation(null)} />
        <SbuToast toast={toast} onClose={() => setToast(null)} />
      </main>
    );
  }

  return (
    <main className="page wide-page fade-page sbu-page">
      <div className="sbu-page-head">
        <div className="page-intro"><h1>SBU management</h1><p>Manage access, quota, brand coverage, and regional ownership across {sbuList.length} strategic business units.</p></div>
        <button className="primary-button" type="button" onClick={() => setCreateOpen(true)}>+ Create SBU</button>
      </div>
      <section className="sbu-summary-band">
        <span><b>{sbuList.reduce((total, item) => total + item.users, 0)}</b><small>Total users</small></span>
        <span><b>{sbuList.reduce((total, item) => total + item.analyses, 0)}</b><small>Total analysis completed</small></span>
        <span><b>{sbuList.reduce((total, item) => total + item.collections, 0)}</b><small>Total collections</small></span>
      </section>
      <div className="sbu-grid">{sbuList.map((item) => <SbuCard key={item.id} sbu={item} onOpen={() => navigate(`/admin/users/${item.id}`)} />)}</div>
      {createOpen ? <SbuModal title="Create SBU" subtitle="Set up a strategic business unit and assign its first admin." actionLabel="Create SBU" onClose={() => setCreateOpen(false)} onSuccess={(text) => setToast({ type: 'success', text })} /> : null}
      <ActionConfirmModal action={confirmation} onClose={() => setConfirmation(null)} />
      <SbuToast toast={toast} onClose={() => setToast(null)} />
    </main>
  );
}

export default UserManagementPage;